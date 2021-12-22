<template>
    <div>
        <el-row>
            <el-col>
                <el-input type="textarea" :rows="10" placeholder="请输入意见" v-model="contentInput"></el-input>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import DataFormService from './js/data-form-service';
const userId = JSON.parse(localStorage.getItem('user-info')) || {};
export default {
    name: 'batch-submit',
    mixins:[DataFormService],
    props: {
        selectedItems: Array,
        batchType: Number,
    },
    data: function() {
        return {
            contentInput: '',
            selectValue: '',
            disabled: false,
            options: [{ label: '同意', value: '1' }],
        };
    },

    methods: {
        confirmAction: function() {
            // var _type = '';
            let s2ActionName='';
            if (this.batchType == 0) {
                s2ActionName='BatchSubmitButton';
            } else {
                s2ActionName='BatchReturnButton';
            }
            return this.DataFormServiceSubmitFormData(this,{
                S2ActionName:s2ActionName,
                WorkItemIds: this.selectedItems,
                CommentText: this.contentInput,
                UserId: userId.ObjectID,
            }).then(res => {
                if (res.Result) {
                    this.$message({ type: 'success', message: '批量提交成功' });
                    this.$emit('confirm');
                } else {
                    this.$message({ type: 'error', message: '批量提交失败' });
                }
            });
        },
    },
};
</script>

<style scoped>
.el-button {
    margin-bottom: 5px;
}
.el-select {
    width: 100%;
    margin: 10px 0 0 0;
}
</style>
