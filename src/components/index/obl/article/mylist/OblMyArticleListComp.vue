<template>
    <div class="articleListCls">
        <a-list
            size="large"
            rowKey="id"
            :loading="loading"
            itemLayout="vertical"
            :dataSource="data"
        >
            <a-list-item :key="item.fid" slot="renderItem" slot-scope="item">
                <template slot="actions">
                    <icon-text type="star-o" :text="item.collectCount"/>
                    <icon-text type="like-o" :text="item.likeCount"/>
                    <icon-text type="message" :text="item.commentCount"/>
                </template>
                <a-list-item-meta>
                    <a slot="title">{{ item.title }}</a>
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
                <article-list-content v-bind="item"/>
            </a-list-item>
            <div slot="footer" v-if="data.length > 0" style="text-align: center; margin-top: 16px;">
                <a-button @click="loadMore" :loading="loadingMore">{{$t('langMap.button.actions.loadMore')}}</a-button>
            </div>
        </a-list>
    </div>
</template>

<script>
    import {OblMyArticleListCompApi} from './oblMyArticleListCompApi.js'
    import ArticleListContent from '~Components/index/obl/article/basic/ArticleListContent'
    import IconText from '~Components/regular/common/IconText'

    export default {
        name: 'OblMyArticleList',
        components: {
            IconText,
            ArticleListContent
        },
        data() {
            return {
                loading: true,
                loadingMore: false,
                data: []
            }
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList() {
                OblMyArticleListCompApi.querySelfDtoPage().then(res => {
                    this.data = res.gridList;
                    this.loading = false
                })
            },
            loadMore() {
                this.loadingMore = true;
                OblMyArticleListCompApi.querySelfDtoPage().then(res => {
                    this.data = this.data.concat(res.gridList)
                }).finally(() => {
                    this.loadingMore = false
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
