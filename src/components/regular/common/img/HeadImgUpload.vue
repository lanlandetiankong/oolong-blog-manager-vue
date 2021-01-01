<template>
    <div>
        <a-upload
            name="file"
            class="avatar-uploader"
            listType="picture-card"
            :showUploadList="false"
            :beforeUpload="beforeImgUpload"
            :data="uploadConf.moreData"
            :action="uploadConf.action"
            :headers="uploadConf.headers"
            @change="handleUploadChange"
        >
            <img v-if="uploadConf.headImgRealUri" :src="uploadConf.headImgRealUri" :alt="$t('langMap.table.fields.em.user.avatarUrl')" :style="uploadConf.imgDomStyle"/>
            <div v-else>
                <a-icon :type="uploadConf.loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
            </div>
        </a-upload>
    </div>
</template>

<script>
    import constantParams from '~Config/constantParams'
    import BeeUtil from '~Assets/js/util/bee/BeeUtil.js'
    import baseUrl from '~Config/axios/baseUrl.js'
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    export default {
        name: "HeadImgUpload",
        props:{
            singleLargeSize:Number,
            moreDataObj:Object,
            avatarUrl:String
        },
        data(){
            //上传图片的路径
            var uploadFieleUrl = "/commonApi/file/imgUpload/headImgUpload";
            var cfgAuthorization = window.sessionStorage.getItem("authorization");
            cfgAuthorization = typeof cfgAuthorization == "undefined" ? "" : cfgAuthorization ;
            return {
                uploadConf:{
                    accept:".png, .jpg, .jpeg",
                    action:baseUrl+uploadFieleUrl,
                    directory:false,
                    moreData:{
                        a:"a"
                    },
                    headers:{
                        authorization:cfgAuthorization
                    },
                    loading:false,
                    imageUri:'',
                    headImgRealUri:'',
                    imgDomStyle:{
                        maxWidth:"100px",
                        maxHeight:"100px"
                    },
                    uploadImgObj:{
                        fileLocation:"",
                        fileName:"",
                        fileOldName:"",
                        fileUri:"",
                        http:""
                    }
                }
            }
        },
        methods:{
            beforeImgUpload(file){
                const isJPG = file.type === 'image/jpeg'|| file.type === 'image/jpg';
                const isPng = file.type === 'image/png';
                const isLt2M = file.size / this.largeSizeComp ;
                if(isJPG || isPng){
                    if (!isLt2M) {
                        this.$message.error(this.$t('langMap.commons.valueMap.uploader.popover.message.image.limitSize',[2]));
                    }
                }   else {
                    this.$message.error(this.$t('langMap.commons.valueMap.uploader.popover.message.image.onlySupportJpg'));
                }
                return (isJPG || isPng) && isLt2M;
            },
            handleUploadChange(info) {

                if (info.file.status === 'uploading') {
                    this.uploadConf.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    //文件个数
                    let fileListLen = info.fileList.length ;
                    var resp = info.fileList[fileListLen-1].response ;
                    if(resp.success){
                        var fileResBeanTemp  = resp.fileResBean ;
                        this.uploadConf.imageUri =  fileResBeanTemp.fileUri ;
                        this.uploadConf.uploadImgObj = fileResBeanTemp ;
                        this.dealImgUriToReal() ;
                    }   else {
                        this.$message.error(resp.msg);
                    }
                    this.uploadConf.loading = false;
                }
                if (info.file.status === 'error') {
                    console.log("error") ;
                }

            },
            dealUploadReset(){  //清空上传框的内容
                this.uploadConf.imageUri = "" ;
                this.uploadConf.uploadImgObj = {} ;
            },
            dealImgUriToReal(){ //设置真正展示的图片地址
                var _this = this ;
                var urlPrefix = constantParams.props.upload.url.prefix ;
                var imgUri = "" ;
                var showImgFlag = true ;
                if(BeeUtil.StringUtils.isBlank(_this.uploadConf.imageUri)){
                    if(BeeUtil.StringUtils.isNotBlank(_this.avatarUrl)){
                        imgUri = _this.avatarUrl ;
                    }   else {
                        showImgFlag = false ;
                    }
                }   else {
                    imgUri = _this.uploadConf.imageUri ;
                }
                _this.uploadConf.headImgRealUri =  showImgFlag ? urlPrefix + imgUri : "" ;
            }
        },
        computed:{
            largeSizeComp(){    //单文件最大上传
                var largeSizeTemp = this.singleLargeSize ;
                if(typeof largeSizeTemp == "undefined" || largeSizeTemp == null){   //如果没指定，默认2mb
                    largeSizeTemp = 1024 * 1024 * 2 ;
                }
                return largeSizeTemp ;
            },
            avatarUrlVal(){   //展示的图片的真实地址
                var _this = this ;
                var imgUri = "" ;
                var showImgFlag = true ;
                if(BeeUtil.StringUtils.isBlank(_this.uploadConf.imageUri)){
                    if(BeeUtil.StringUtils.isNotBlank(_this.avatarUrl)){
                        imgUri = _this.avatarUrl ;
                    }   else {
                        showImgFlag = false ;
                    }
                }   else {
                    imgUri = _this.uploadConf.imageUri ;
                }
                return showImgFlag ?  imgUri : "" ;
            }
        },
        mounted(){
            this.dealImgUriToReal();
        }

    }
</script>

<style scoped>
    .avatar-uploader > .ant-upload {
        width: 128px;
        height: 128px;
    }
    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
</style>
