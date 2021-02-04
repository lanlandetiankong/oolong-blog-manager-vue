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
        name: "SysPage",
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
        methods:{

        },
        watch:{
            cachedViews() {
                this.mixin_refreshChildViewCaches(this,"SysPage") ;
            }
        },
        created(){
            this.mixin_refreshChildViewCaches(this,"SysPage");
        }
    }
</script>

<style scoped>

</style>
