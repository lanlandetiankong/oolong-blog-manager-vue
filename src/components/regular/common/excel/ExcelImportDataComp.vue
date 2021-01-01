<template>
    <div>
        <a-modal
            :visible="visible"
            :maskClosable=false
            :title="modalCompTitle"
            :okText="$t('langMap.button.actions.confirmSubmit')"
            :cancelText="$t('langMap.button.actions.cancel')"
            @cancel="() => { $emit('modalCancel')}"
            @ok="handleModalSubmit"
        >
            <div>
                <a-upload
                    :accept="uploadConf.accept"
                    :fileList="fileList"
                    :remove="handleRemove"
                    :beforeUpload="handleBeforeUpload"
                    :data="uploadConf.processData"
                    @change="handleUploadChange"
                >
                    <a-button :disabled="fileList.length >= limitSize"> <a-icon type="upload" />
                        <template v-if="limitSize == limitMinSize">
                            {{$t('langMap.commons.valueMap.uploader.popover.maximumNumberOfFiles',[limitSize])}}
                        </template>
                        <template v-else>
                            {{$t('langMap.commons.valueMap.uploader.popover.rangeSizeOfFiles',[limitMinSize,limitSize])}}
                        </template>

                    </a-button>
                </a-upload>
                <a-popover :title="$t('langMap.commons.valueMap.uploader.popover.prompt')" trigger="hover" placement="leftBottom">
                    <template slot="content">
                        <a-alert :message="$t('langMap.commons.valueMap.uploader.popover.message.excel')" type="warning" showIcon />
                    </template>
                    <a-button
                        type="primary"
                        @click="handleUpload"
                        :disabled="fileList.length === 0 || (fileList.length - uploadedFileList.length < 1)"
                        :loading="uploading"
                        v-show="false"
                        style="margin-top: 16px"
                    >
                        {{uploading ? $t('langMap.commons.valueMap.uploader.status.uploading') : $t('langMap.commons.valueMap.uploader.status.confirmUpload') }}
                    </a-button>
                </a-popover>
            </div>
        </a-modal>
    </div>
</template>
<script>
    import BeeUtil from '~Assets/js/util/bee/BeeUtil.js' ;
    import {jsObjectToFormData} from '~Assets/js/util/baseUtil.js' ;

    export default {
        name: "ExcelImportDataComp",
        props:{
            visible:Boolean,
            modalCompTitle:String,
            limitSize:{
                type:Number,
                default:1
            },
            limitMinSize:{
                type:Number,
                default:1
            },
            moreData:{
                type:Object,
                default:{}
            },
            uploadedBeanList:{
                type:Array,
                default:[]
            }
        },
        data(){
            return {
                uploadConf:{
                    accept:"application/vnd.ms-excel",
                    processData:{},
                },
                fileList: [],
                uploadedFileList:[],
                uploading: false,
            }
        },
        methods:{
            dealVerifyIsExcel(fileName){    //验证是否合法的Excel文件格式
                var flag = BeeUtil.StringUtils.endsWith(fileName,".xls") ||  BeeUtil.StringUtils.endsWith(fileName,".xlsx");
                return flag;
            },
            handleRemove(file) {    //文件移除
                const index = this.fileList.indexOf(file);
                const newFileList = this.fileList.slice();
                newFileList.splice(index, 1);
                this.fileList = newFileList;
                const uploadIndex = this.uploadedFileList.indexOf(file);
                const newUploadFileList = this.uploadedFileList.slice();
                newUploadFileList.splice(uploadIndex, 1);
                this.uploadedFileList = newUploadFileList;
            },
            handleBeforeUpload(file,fileList) { //
                if(this.dealVerifyIsExcel(file.name) === true){
                    this.fileList = [...this.fileList, file];
                }   else {
                    this.$message.warning(this.$t('langMap.commons.valueMap.uploader.popover.message.excel')) ;
                }
                return false;
            },
            handleUpload() {    //文件上传
                //Nothing
            },
            handleUploadChange(e){
                //Nothing
                //console.log("change",e);
            },
            handleModalSubmit(e){
                var _this = this ;
                const { fileList } = this;
                if(fileList.length < _this.limitMinSize){
                    _this.$message.warning(_this.$t('langMap.commons.valueMap.uploader.popover.atLeastNumberOfFiles',[_this.limitMinSize]));
                    return false ;
                }
                var formData = new FormData();
                fileList.forEach(file => {
                    formData.append('files', file);
                });
                formData = jsObjectToFormData(this.uploadConf.processData,formData);
                this.$emit("modalSubmit",formData,this.uploadConf.processData) ;
            }
        },
        watch:{
            visible:{
                handler(val,oval){  //隐藏与展示弹窗时监听
                    if(val == true){
                        var processDataTemp = Object.assign(this.moreData, this.uploadConf.processData);
                        this.uploadConf.processData = processDataTemp ;
                        //合并prop的已上传文件
                        this.uploadedFileList = [...this.uploadedBeanList,...this.uploadedFileList];
                        this.fileList = [...this.uploadedFileList];
                    }
                    this.uploading = false;
                },
                deep: true,
                immediate:true
            }
        }

    }
</script>
<style>

</style>
