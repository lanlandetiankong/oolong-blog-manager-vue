<template>
  <a-list
    size="large"
    rowKey="id"
    :loading="loading"
    itemLayout="vertical"
    :dataSource="data"
  >
    <a-list-item :key="item.fid" slot="renderItem" slot-scope="item">
      <template slot="actions">
        <icon-text type="star-o" :text="0" />
        <icon-text type="like-o" :text="0" />
        <icon-text type="message" :text="0" />
      </template>
      <a-list-item-meta>
        <a slot="title">{{ item.title }}</a>
        <template slot="description">
          <span>
            <a-tag>标签</a-tag>
          </span>
        </template>
      </a-list-item-meta>
      <article-list-content v-bind="item" />
    </a-list-item>
    <div slot="footer" v-if="data.length > 0" style="text-align: center; margin-top: 16px;">
      <a-button @click="loadMore" :loading="loadingMore">加载更多</a-button>
    </div>
  </a-list>
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
  data () {
    return {
      loading: true,
      loadingMore: false,
      data: []
    }
  },
  mounted () {
    this.getList();
  },
  methods: {
    getList () {
        OblMyArticleListCompApi.querySelfDtoPage().then(res => {
            this.data = res.gridList;
            this.loading = false
          })
    },
    loadMore () {
      this.loadingMore = true
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

</style>
