<template functional>
    <a-sub-menu
        :key="props.menuInfo.key"
    >
    <span slot="title">
        <a-icon :type="props.menuInfo.iconName" />
        <span>{{ props.menuInfo.name }}</span>
    </span>
        <template v-for="item in props.menuInfo.children">
            <a-menu-item
                v-if="!item.children"
                :key="item.key"
            >
                <!-- Router地址跳转 -->
                <template v-if="item.urlJumpType == 1" >
                    <router-link
                        :style="{color:'#fff'}"
                        :to="item.routerUrl"
                        :key="item.key">
                        <a-icon :type="item.iconName" />
                        <span>{{ item.name }}</span>
                    </router-link>
                </template>
                <!-- 在当前页面打开外部链接 -->
                <template v-else-if="item.urlJumpType == 2">
                    <a :href="item.hrefUrl" :style="{color:'#fff'}">
                        <a-icon :type="item.iconName" />
                        <span>{{ item.name }}</span>
                    </a>
                </template>
                <!-- 在新页面打开外部链接 -->
                <template v-else-if="item.urlJumpType == 3">
                    <a :href="item.hrefUrl" :style="{color:'#fff'}" target="_blank">
                        <a-icon :type="item.iconName" />
                        <span>{{ item.name }}</span>
                    </a>
                </template>

            </a-menu-item>
            <sub-menu-comp
                v-else
                :key="item.key"
                :menu-info="item"
            />
        </template>
    </a-sub-menu>
</template>


<script>
    export default {
        name: "SubMenuComp",
        props: ['menuInfo']
    }
</script>

<style scoped>

</style>
