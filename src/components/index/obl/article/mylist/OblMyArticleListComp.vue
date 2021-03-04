<template>
    <div class="articleListCls">
        <a-list
            size="large"
            rowKey="id"
            :loading="listConf.loading"
            itemLayout="vertical"
            :dataSource="listConf.data"
        >
            <a-list-item :key="item.fid" slot="renderItem" slot-scope="item">
                <template slot="actions">
                    <icon-text type="star-o" :text="item.collectCount"/>
                    <icon-text type="like-o" :text="item.likeCount"/>
                    <icon-text type="message" :text="item.commentCount"/>
                </template>
                <a-list-item-meta>
                    <a slot="title" @click="goToViewDetail($event,item)">{{ item.title }}</a>
                    <template slot="description">
                        <a-row>
                            <span v-for="categoryNamItem in item.categoryNameList">
                                <a-tag color="#108ee9">{{categoryNamItem}}</a-tag>
                            </span>
                            <a-divider type="vertical"/>
                            <span v-for="tagItem in item.tagNameList">
                                <a-tag color="#87d068">{{tagItem}}</a-tag>
                            </span>
                        </a-row>
                    </template>
                </a-list-item-meta>
                <article-list-content v-bind="item"
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
    import {OblMyArticleListCompApi} from './oblMyArticleListCompApi.js'
    import ArticleListContent from '~Components/index/obl/article/basic/ArticleListContent'
    import IconText from '~Components/regular/common/IconText'
    import {UrlUtils} from "~Utils/basic/BeeUtil";

    export default {
        name: 'OblMyArticleList',
        components: {
            IconText,
            ArticleListContent
        },
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
            goToViewDetail(e,record) {  //跳转到文章展示页面
                if(!record){
                    return ;
                }
                let params = record ;
                let url = UrlUtils.objToUrl(this.mixinData.BaseDataConst.routerConst.article.display,params);
                this.mixin_jump(url);
            },
            getList() {
                OblMyArticleListCompApi.querySelfDtoPage(this.listConf).then(res => {
                    this.listConf.data = res.gridList;
                    this.listConf.loading = false;
                    this.listConf.pagination.total = res.vpage.total ;
                    this.listConf.pagination.current += 1 ;
                })
            },
            loadMore() {
                this.listConf.loadingMore = true;
                OblMyArticleListCompApi.querySelfDtoPage(this.listConf).then(res => {
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
    .articleListCls {
        text-align: left;
    }
</style>
