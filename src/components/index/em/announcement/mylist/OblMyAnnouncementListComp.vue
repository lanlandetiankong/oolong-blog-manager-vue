<template>
    <div class="announcementListCls">
        <a-list
            size="large"
            rowKey="id"
            :loading="listConf.loading"
            itemLayout="vertical"
            :dataSource="listConf.data"
        >
            <a-list-item :key="item.fid" slot="renderItem" slot-scope="item">
                <a-list-item-meta>
                    <a slot="title" @click="goToViewDetail($event,item)">{{ item.title }}</a>
                    <template slot="description">
                        <a-row>
                            <span v-for="tagItem in item.tagNames">
                                <a-tag color="#87d068">{{tagItem}}</a-tag>
                            </span>
                        </a-row>
                    </template>
                </a-list-item-meta>
                <announcement-list-content v-bind="item"
                                           @click="goToViewDetail($event,item)"/>
            </a-list-item>
            <div slot="footer" v-if="listConf.data.length > 0" style="text-align: center; margin-top: 16px;">
                <a-button v-show="hasMoreData"
                    @click="loadMore" :loading="listConf.loadingMore">{{$t('langMap.button.actions.loadMore')}}</a-button>
            </div>
        </a-list>
    </div>
</template>

<script>
    import {OblMyAnnouncementListCompApi} from './oblMyAnnouncementListCompApi.js'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import AnnouncementListContent from '~Components/index/em/announcement/basic/AnnouncementListContent'
    import IconText from '~Components/regular/common/IconText'
    import BeeUtil from "~Assets/js/util/bee/BeeUtil";

    export default {
        name: 'OblMyAnnouncementListComp',
        components: {
            IconText,
            AnnouncementListContent
        },
        mixins:[OblCommonMixin],
        data() {
            return {
                listConf:{
                    data: [],
                    loading: true,
                    loadingMore: false,
                    pagination: {
                        current:1,
                        pageSize:10,
                        total:0
                    },
                },

            }
        },
        computed:{
            hasMoreData(){  //判断是否还有更多数据
                let pagination = this.listConf.pagination ;
                return pagination.total > pagination.current * pagination.pageSize ;
            }
        },
        mounted() {
            this.getList();
        },
        methods: {
            goToViewDetail(e,item) {  //跳转到文章展示页面
                let params = item ;
                let url = BeeUtil.UrlUtils.objToUrl(this.mixinData.routerConst.announcement.display,params);
                this.mixin_jump(url);
            },
            getList() {
                OblMyAnnouncementListCompApi.querySelfDtoPage(this.listConf).then(res => {
                    this.listConf.data = res.gridList;
                    this.listConf.loading = false;
                    this.listConf.pagination.total = res.vpage.total ;
                    this.listConf.pagination.current += 1 ;
                })
            },
            loadMore() {
                this.listConf.loadingMore = true;
                OblMyAnnouncementListCompApi.querySelfDtoPage(this.listConf).then(res => {
                    this.listConf.data = this.listConf.data.concat(res.gridList);
                    this.listConf.pagination.total = res.vpage.total ;
                    this.listConf.pagination.current += 1 ;
                }).finally(() => {
                    this.listConf.loadingMore = false;
                })
            }
        }
    }
</script>

<style scoped>
    .announcementListCls {
        text-align: left;
    }
</style>
