<template>
    <a-result
        status="error"
        :title="$t('langMap.results.universal.serverDown.title')"
    >
        <template #extra>
            <a-button key="console" type="primary" @click="goBack">
                {{$t('langMap.results.universal.serverDown.message.goBack')}}
            </a-button>
        </template>

        <div class="desc">
            <p style="font-size: 16px;">
                <strong>{{$t('langMap.results.universal.serverDown.message.main')}}</strong>
            </p>
            <p>
                <a-icon :style="{ color: 'red' }" type="close-circle" /> {{$t('langMap.results.universal.serverDown.message.secondary')}}
            </p>
        </div>
    </a-result>
</template>
<script>
    export default {
        name:'ServerDownView',
        data() {
            return {};
        },
        methods:{
            goBack(){
                this.$router.go(-1);//返回上一层
            }
        }
    };
</script>
<style scoped>
    .desc p {
        margin-bottom: 1em;
    }
</style>
