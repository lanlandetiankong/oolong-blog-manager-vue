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
        name: "EmployeePage",
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
                this.mixin_refreshChildViewCaches(this,"EmployeePage") ;
            }
        },
        created(){
            this.mixin_refreshChildViewCaches(this,"EmployeePage");
        }
    }
</script>

<style scoped>

</style>
