<template>
    <div class="basic-announcement-content-comp-cls" @click="$emit('click')">
        <div class="content">
            <slot>
                {{ shortContent }}
            </slot>
        </div>
        <div class="extra">
            <a-avatar :src="authorAvatarUrl" size="small"/>
            <a-icon type="user"/>
            {{ authorName }}
            <a-icon type="clock"/>
            {{ publishTime | formatBaseDateTime }}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AnnouncementListContent',
        props: {

            shortContent: {
                type: String,
                default: ''
            },
            authorName: {
                type: String,
                required: true
            },
            authorAvatarUrl: {
                type: String,
                required: true
            },
            publishTime: {
                type: Number,
                required: true
            }
        }
    }
</script>

<style lang="less" scoped>
    .basic-announcement-content-comp-cls {
        text-align: left;
        .description {
            max-width: 720px;
            line-height: 22px;
        }

        .extra {
            margin-top: 16px;
            line-height: 22px;

            & /deep/ .ant-avatar {
                position: relative;
                top: 1px;
                width: 20px;
                height: 20px;
                margin-right: 8px;
                vertical-align: top;
            }

            & > em {
                margin-left: 16px;
                font-style: normal;
            }
        }

        .ant-list-item {
            display: block;
            margin-top: 8px;
            margin-left: 0;
        }

        .ant-list-item-no-flex {
            display: block;
            margin-top: 8px;
            margin-left: 0;
        }
    }
</style>
