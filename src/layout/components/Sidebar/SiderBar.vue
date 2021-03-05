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
        methods: {
            dealMenuClick(obj) {
                this.$emit('sideBar-menu-open',obj.item,obj.key,obj.keyPath);
            },
        },
    }
</script>

<style scoped>
@import "./_SiderBar.less";
</style>
