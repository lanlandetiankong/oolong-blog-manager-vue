<template>
    <div>
        <div>
            <a-list class="my-announcement-list"
                :itemLayout="layoutConf.list.itemLayout"
                :dataSource="dataList"
                :locale="listConf.locale"
                :rowKey="item => item.fid"
            >
                <a-list-item slot="renderItem" slot-scope="item,index" :style="layoutConf.listItem.styleConf">
                    <a slot="actions" @click="handleViewAnnouncementItemClick($event,item)">{{$t('langMap.button.actions.lookOver')}}</a>
                    <a-list-item-meta
                    >
                        <span slot="title">{{item.title}}</span>
                        <span slot="description" >{{item.shortContent}}</span>
                    </a-list-item-meta>
                    <span slot="avatar"></span>
                </a-list-item>
            </a-list>
        </div>
    </div>
</template>
<script>
    import AListItem from "ant-design-vue/es/list/Item";
    export default {
        name: "AnnouncementListComp",
        components: {AListItem},
        props:{
            dataList:Array
        },
        data() {
            return {
                layoutConf:{
                    list:{
                        itemLayout:"horizontal",
                    },
                    listItem:{
                        styleConf:{
                            textAlign:"left"
                        }
                    }
                },
                listConf:{
                    locale:{
                        emptyText:this.$t('langMap.table.config.emptyData')
                    }
                }
            };
        },
        methods:{
            handleViewAnnouncementItemClick(e,item){     //点击查看 事件
                this.$emit('viewItemClick',e,item);
            }
        }
    }
</script>
<style>
    .my-announcement-list {
        min-height: 350px;
    }
</style>
