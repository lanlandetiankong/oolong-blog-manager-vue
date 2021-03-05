const _import = require('~Router/_import_' + process.env.NODE_ENV);
//所挂载的 page 组件名
const parentRouterCompName = "AnnouncementPage";
let basePath = 'announcement/';
const AnnouncementRouter = [{
        path:basePath+'create',
        component: _import('index/em/announcement/create/AnnouncementCreateView'),
        name: 'announcementCreate',
        meta: {
            title: '创建通知公告', icon: "reconciliation", keepAliveFlag: true,
            parentRouterCompName,
            selfCompName: 'AnnouncementCreateView'
        }
    },
    {
        path:basePath+'all_list',
        component: _import('index/em/announcement/allList/AnnouncementAllListView'),
        name: 'announcementAllList',
        meta: {
            title: '公告列表', icon: "bars", keepAliveFlag: true,
            parentRouterCompName,
            selfCompName: 'AnnouncementAllListView'
        }
    },
    {
        path:basePath+'my_create_list',
        component: _import('index/em/announcement/myCreateList/AnnouncementMyCreateListView'),
        name: 'announcementMyCreateList',
        meta: {
            title: '我创建的公告列表', icon: "bars", keepAliveFlag: true,
            parentRouterCompName,
            selfCompName: 'AnnouncementMyCreateListView'
        }
    },
    {
        path:basePath+'announcement_tag',
        component: _import('index/em/announcement/tag/AnnouncementTagView'),
        name: 'announcementTag',
        meta: {
            title: '公告标签', icon: "reconciliation", keepAliveFlag: true,
            parentRouterCompName,
            selfCompName: 'AnnouncementTagView'
        }
    },
    {
        path:basePath+'my_draft_list',
        component: _import('index/em/announcement/myDraftList/AnnouncementMyDraftListView'),
        name: 'announcementMyDraftList',
        meta: {
            title: '草稿箱', icon: "bars", keepAliveFlag: true,
            parentRouterCompName,
            selfCompName: 'AnnouncementMyDraftListView'
        }
    },
    {
        path:basePath+'display',
        component: _import('index/em/announcement/display/AnnouncementDisplayView'),
        name: 'announcementDisplay',
        meta: {
            title: '公告展示', icon: "book", keepAliveFlag: true,
            visitLimit: false,
            parentRouterCompName,
            selfCompName: 'AnnouncementDisplayView'
        }
    }];
export default AnnouncementRouter;
