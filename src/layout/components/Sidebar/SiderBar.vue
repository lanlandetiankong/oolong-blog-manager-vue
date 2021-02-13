<template>
    <div id="sider-bar-root">
        <a-menu
            mode="inline"
            theme="dark"
            class="index-menu"
            @click="dealMenuClick"
        >
            <template v-for="item in menuList">
                <a-menu-item v-if="!item.children"
                             :key="item.key">
                    <a-icon :type="item.iconName"/>
                    <span>{{item.name}}</span>
                </a-menu-item>
                <sub-menu-comp v-else
                               :menu-info="item"
                               :key="item.key"/>
            </template>
        </a-menu>
    </div>
</template>

<script>

    import SubMenuComp from '~Components/regular/layout/menu/SubMenuComp' ;
    export default {
        name: "SiderBar",
        components: {
            SubMenuComp,
        },
        props:{
            siderCollapsed:Boolean,
            menuList:Array
        },
        data () {
            return {

            }
        },
        computed: {
        },
        methods: {
            dealMenuClick(obj) {
                this.$emit('sideBar-menu-open',obj.item,obj.key,obj.keyPath);
            },
            dealGotoIndex(){
                var _currentRoute = this.$route;
                if(_currentRoute){
                    if(_currentRoute.fullPath == "" || _currentRoute.fullPath == "/index"){
                        //当前已经在 index页面了，无需再跳转
                    }   else {
                        this.$router.push('/index');
                    }
                }
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
@import "./_SiderBar.less";
</style>
