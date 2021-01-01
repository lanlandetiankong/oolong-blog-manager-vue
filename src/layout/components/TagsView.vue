<template>
    <div class="tags-view-container">
        <vue-scroll class="tags-view-wrapper">
            <router-link ref='tagsRef'
                         v-for="tag in tagsArray"
                         class="tags-view-item"
                         :class="checkIsTagActive(tag)?'active':''"
                         :to="tag.path"
                         :key="tag.id"
                         @click.native="handleTagItemNativeClick(tag,$event)"
                         @contextmenu.prevent.native="handleOpenContextMenu(tag,$event)"
            >
                <template v-if="typeof tag.meta.icon != 'undefined' && tag.meta.icon != null && tag.meta.icon != '' ">
                    <a-icon :type="tag.meta.icon" />
                </template>
                {{tag.title}}&nbsp;
                <a-icon type="close" @click.prevent.stop="handleSelectedTagItemClose(tag,$event)"/>
            </router-link>
        </vue-scroll>
        <ul class='contextmenu' v-show="contextMenuConf.visible" :style="{left:contextMenuConf.left+'px',top:contextMenuConf.top+'px'}">
            <li @click="handleSelectedTagItemClose(selectedTag,$event)">{{$t('langMap.layout.tagsView.close')}}</li>
            <li @click="handleOthersTagItemClose">{{$t('langMap.layout.tagsView.closeOther')}}</li>
            <li @click="handleAllTagItemClose">{{$t('langMap.layout.tagsView.closeAll')}}</li>
            <li @click="dealHiddentContextMenu">{{$t('langMap.layout.tagsView.cancelOperation')}}</li>
        </ul>
    </div>
</template>

<script>

    export default {
        components: {},
        props: {
            tagsArray: {
                type: Array,
                required: true
            },
            selectedTag: {}
        },
        data() {
            return {

            }
        },
        computed: {
            contextMenuConf() {
                return this.$store.state.tagsView.contextMenuBaseConf ;
            }
        },
        watch: {
            $route() {
                this.doAddViewTags() ;
                this.doMoveToCurrentTag();
            },
        },
        mounted() {
            this.doAddViewTags() ;
            this.doMoveToCurrentTag();
        },
        methods: {
            checkIsTagActive(tag) {
                //当前tag跟所选的tag相同时修改样式
                var selectedTagTemp = this.selectedTag ;
                return tag.path === selectedTagTemp.path ;
            },
            doMoveToCurrentTag() {
                const tags = this.$refs.tagsRef;
                if(!tags){
                    var tagsArrayTemp = this.tagsArray ;
                    if(tagsArrayTemp.length > 0) {
                        this.$emit("toggle-current-tag",tagsArrayTemp[0]);
                    }
                }   else {
                    this.$nextTick(() => {
                        for (const tag of tags) {
                            if (tag.to === this.$route.path) {
                                this.$emit("toggle-current-tag",this.$route);
                                break;
                            }
                        }
                    })
                }
            },
            handleSelectedTagItemClose(selectedTag,e){
                this.$emit('tag-item-selected-close',e,selectedTag,this.checkIsTagActive(selectedTag)) ;
                this.dealHiddentContextMenu();
            },
            handleOthersTagItemClose(selectedTag,e){
                this.$emit('tag-item-others-close',e,selectedTag,this.checkIsTagActive(selectedTag)) ;
                this.dealHiddentContextMenu();
            },
            handleAllTagItemClose(e){
                this.$emit('tag-item-all-close') ;
                this.dealHiddentContextMenu();
            },
            dealHiddentContextMenu(){
                //隐藏 右键关闭 菜单
                this.$store.dispatch('doSetHiddenContextMenuPosition');
            },
            dealGenerateRoute() {
                if (this.$route.name) {
                    return this.$route
                }
                return false
            },
            doAddViewTags() {
                const route = this.dealGenerateRoute()
                if (!route) {
                    return false ;
                }
                if(route.meta.hiddenTag){
                    return false ;
                }
                this.$store.dispatch('doAddVisitedViews', route);
            },
            handleOpenContextMenu(tag, e) {
                this.$store.dispatch('doSetContextMenuPosition',{
                    visible:true,
                    left:e.clientX,
                    top:e.clientY
                }) ;
            },
            handleTagItemNativeClick(tag,e){
                this.$emit('tag-item-native-click',e,tag);
            }
        }
    }
</script>
<style  lang="less" scoped>
    .tags-view-container {
        .tags-view-wrapper {
            background: #fff;
            height: 34px;
            border-bottom: 1px solid #d8dce5;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
            .tags-view-item {
                display: inline-block;
                position: relative;
                height: 26px;
                line-height: 26px;
                border: 1px solid #d8dce5;
                color: #495060;
                background: #fff;
                padding: 0 8px;
                font-size: 12px;
                margin-left: 5px;
                margin-top: 4px;
                &:first-of-type {
                    margin-left: 15px;
                }
                &.active {
                    background-color: #3b200c;
                    border-color: #3b200c;
                    color: #fff;
                    &::before {
                        content: '';
                        background: #fff;
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        position: relative;
                        margin-right: 2px;
                    }
                }
            }
        }
        .contextmenu {
            margin: 0;
            background: #fff;
            z-index: 100;
            position: absolute;
            list-style-type: none;
            padding: 5px 0;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 400;
            color: #333;
            box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
            li {
                margin: 0;
                padding: 7px 16px;
                cursor: pointer;
                &:hover {
                    background: #eee;
                }
            }
        }
    }
</style>
<style  lang="less">
    .tags-view-wrapper {
        .tags-view-item {
            .el-icon-close {
                width: 16px;
                height: 16px;
                vertical-align: 2px;
                border-radius: 50%;
                text-align: center;
                transition: all .3s cubic-bezier(.645, .045, .355, 1);
                transform-origin: 100% 50%;
                &:before {
                    transform: scale(.6);
                    display: inline-block;
                    vertical-align: -3px;
                }
                &:hover {
                    background-color: #b4bccc;
                    color: #fff;
                }
            }
        }
    }
</style>
