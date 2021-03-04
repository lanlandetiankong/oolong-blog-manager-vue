<template>
    <quill-editor
        v-model="contentVal"
        class="quillCls"
        ref="quillEditor"
        :options="quillEditorConfig.quillOption"
        @change="handleQuillEditorChange"
    >
    </quill-editor>
</template>

<script>
    import baseUrl from '~Config/axios/baseUrl.js'
    import {quillToolbarConfig} from '~Config/editor/quill/myQuillEditorConfig.js'
    //使用 扩展模块
    import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
    import ImageResize from 'quill-image-resize-module'
    Quill.register('modules/ImageExtend', ImageExtend);
    Quill.register('modules/ImageResize', ImageResize);
    export default {
        name: "BaseQuillEditor",
        props:{
            content:{
                type:String,
                required:false
            }
        },
        data(){
            var _this = this ;
            //上传图片的路径
            var uploadFieleUrl = "/oblCtl/commonApi/file/imgUpload/ossUploadAnnouncementImg" ;
            return {
                contentVal:'',
                quillEditorConfig:{
                    quillOption:{
                        placeholder:this.$t('langMap.commons.quill.announcement.placeholder'),
                        debug:'warn',
                        readOnly:false,
                        imageDrop: true,
                        modules:{
                            toolbar: {
                                container:quillToolbarConfig.quillToolbarOptions,
                                handlers: {
                                    'image': function () {  // 劫持原来的图片点击按钮事件
                                        QuillWatch.emit(this.quill.id)
                                    }
                                }
                            },
                            history: quillToolbarConfig.quillHistoryOptions,
                            ImageExtend: {
                                loading: true,
                                name: 'file',
                                size:2,
                                action: baseUrl+uploadFieleUrl,
                                response: _this.dealQuillImgExtendResponse,
                                headers:(xhr) => {
                                },
                                change:_this.dealQuillImgExtendChange
                            },
                            ImageResize:{},
                        },
                        scrollingContainer:'y'
                    }
                }
            }
        },
        methods:{
            handleQuillEditorChange(e){
                this.$emit('change',e);
                this.$emit('textChange',e.text);
            },
            dealQuillImgExtendResponse(res){    //quill 图片上传回调
                if(res.success){
                    var fileResObj = res.bean ;
                    //return fileResObj.filePrefix + fileResObj.fileUri
                    return fileResObj.url ;
                }   else {
                    this.$message.error(res.msg) ;
                }
            },
            dealQuillImgExtendChange(xhr, formData){
                //console.log(xhr,formData);
            },
        },
        watch:{
            content: {
                handler (val, oval) {
                    //允许通过传值的方式对contentVal 修改
                    if(val){
                        this.contentVal = val ;
                    }
                },
            }
        }
    }
</script>

<style scoped>
    .quillCls {
        height:300px;
    }
</style>
