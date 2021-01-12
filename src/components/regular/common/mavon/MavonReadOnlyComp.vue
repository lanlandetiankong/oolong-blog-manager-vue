<template>
    <div>
        <mavon-editor
            v-bind="editorConfig"
            v-model="formData.originContent"
        />
    </div>
</template>
<script>
export default {
    name: "MavonReadOnlyComp",
    props:{
        formData:{
            type:Object,
            required:true
        }
    },
    data(){
        return {
            editorConfig:{
                editable:false,
                subfield:false,
                defaultOpen:'preview',
                boxShadowStyle:'0 2px 12px 0 rgba(0, 0, 0, 0.1)',
                toolbarsFlag:false,
                toolbars:{}
            },
        }
    },
    computed:{
    }
}
</script>

<style scoped>

</style>
