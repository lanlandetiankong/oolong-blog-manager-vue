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
        name: "AnnouncementPage",
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
                this.mixin_refreshChildViewCaches(this,"AnnouncementPage") ;
            }
        },
        created(){
            this.mixin_refreshChildViewCaches(this,"AnnouncementPage");
        }
    }
</script>
<style>

</style>
