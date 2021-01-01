<template>
    <div>
        <keep-alive :include="cachedChildrenViews">
            <router-view />
        </keep-alive>
    </div>
</template>
<script>
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    export default {
        name: "OblArticlePage",
        mixins:[OblCommonMixin],
        data(){
            return {
                cachedChildrenViews : []
            }
        },
        computed:{
            cachedViews() {
                return this.$store.state.tagsView.cachedViews ;
            }
        },
        watch:{
            cachedViews() {
                this.mixin_refreshChildViewCaches(this,"OblArticlePage") ;
            }
        },
        created(){
            this.mixin_refreshChildViewCaches(this,"OblArticlePage");
        }
    }
</script>
<style>

</style>
