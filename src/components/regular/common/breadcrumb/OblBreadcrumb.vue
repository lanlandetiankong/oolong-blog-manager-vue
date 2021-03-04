<template>
    <a-breadcrumb :routes="matchedArr">
        <template slot="itemRender" slot-scope="{route, params, routes, paths}">
            <template v-if="route.icon">
                <a-icon :type="route.icon" />
            </template>
            {{route.title}}
        </template>
    </a-breadcrumb>
</template>

<script>
    import {StringUtils} from "~Assets/js/util/bee/BeeUtil";
    export default {
        name: "OblBreadcrumb",
        computed:{
            matchedArr(){
                let arr = [],nameTemp = [];
                this.$route.matched.filter((item,index,self) => {
                    let metaFlag = (item && item.meta) ;
                    if(metaFlag == false){
                        return ;
                    }
                    if(StringUtils.isBlank(item.meta.title)){
                        return ;
                    }
                    let title = (metaFlag && item.meta.title) ? item.meta.title : '' ;
                    let iconVal = (metaFlag && item.meta.icon) ? item.meta.icon : null ;
                    const obj = {
                        title:title,
                        icon:iconVal,
                        path:item.path
                    };
                    arr.push(obj);
                });
                arr.filter((item,index,self) => {
                    if(nameTemp.includes(item.title)){
                        return false ;
                    }   else {
                        nameTemp.push(item.title);
                        return true ;
                    }
                });
                return arr;
            }
        }
    }
</script>

<style scoped>

</style>
