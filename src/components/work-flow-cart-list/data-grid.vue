<template>
    <div
        class="data-grid-class"
        style="height: calc(100% - 80px); display: flex; flex-direction: column; margin-left: 10px"
    >
        <div>
            <el-button
                class="form-button"
                type="primary"
                :disabled="disabled"
                @click="batchSubmit(0)"
                >审批通过</el-button
            >
            <el-button
                class="form-button"
                type="primary"
                :disabled="disabled"
                @click="batchSubmit(1)"
                >审批拒绝</el-button
            >
        </div>
        <div style="width: 100%; flex: 1; overflow-y: auto">
            <el-table
                :data="datas"
                border
                fit
                stripe
                default-expand-all
                :highlight-current-row="false"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    show-overflow-tooltip
                    width="40"
                    :selectable="handleSelectable"
                ></el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <div class="text" v-html="props.row.MessageTempletValue">
                            {{ props.row.MessageTempletValue }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    v-for="item in showColumns"
                    :key="item.Code"
                    :prop="item.Code"
                    :width="item.width"
                    min-width="130"
                    show-overflow-tooltip
                    class-name="auto-width-table-column"
                    :label="item.Title"
                ></el-table-column>
            </el-table>
        </div>
        <div style="height: 54px" class="flex_content_vertical_center">
            <el-pagination
                style="padding-top: 8px"
                background
                layout="prev, pager, next, jumper"
                @current-change="handlePagingIndexChange"
                :page-size="pagingInfo.PageSize"
                :total="pagingInfo.DataCount"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import DataFormService from './js/data-form-service';
import Const from './js/const';
let { IsNull } = Const;

import BatchSubmit from './batch-submit.vue';
export default {
    name: 'data-grid',
    mixins:[DataFormService],
    data: function () {
        return {
            disabled: true,
            showColumns: [
                {
                    Title: '标题',
                    Code: 'Title',
                },
                {
                    Title: '发起人',
                    Code: 'OriginatorName',
                    width: 150,
                },
                {
                    Title: '所属部门',
                    Code: 'OriginatorUnitName',
                },
                {
                    Title: '接收时间',
                    Code: 'ReceiveTime',
                    width: 150,
                },
                {
                    Title: '审批编号',
                    Code: 'SequenceNo',
                    width: 150,
                },
            ],
            datas: [],
            tableHeight: null,
            pagingInfo: {
                PageIndex: 1,
                //默认20
                PageSize: 20,
                DataCount: 0,
                PageCount: 0,
            },
            multipleSelected: [],
        };
    },
    props: {
        searchCondition: Array,
        belongsApp: { type: String, default: '' },
    },
    mounted() {
        this.loadListData(1);
    },
    methods: {
        handleClose() {
            this.$emit('data-list-close');
        },
        handlePagingIndexChange(index) {
            this.loadListData(index);
        },

        loadListData(index) {
            this.pagingInfo.PageIndex = index;
            this.DataFormServiceGetAllBatchProcessingItems(this,{
                PagingInfo: this.pagingInfo,
                SearchCondition: this.searchCondition,
                BelongsApp: this.belongsApp,
            }).then((res) => {
                this.datas = res.Result.Datas;
                if (!IsNull(res.Result.PagerInfo)) {
                    Object.assign(this.pagingInfo, res.Result.PagerInfo);
                }
            });
        },
        multipleConfirm() {
            this.$emit('multiple-selection-changed', this.multipleSelected);
        },
        handleSelectionChange(val) {
            if (val.length == 0) {
                this.disabled = true;
            } else {
                this.disabled = false;
            }
            this.multipleSelected = val;
        },
        batchSubmit: function (type) {
            var othis = this;

            var str = new Array();
            this.multipleSelected.forEach((items) => {
                str.push(items.FlowItemId);
            });
            if (str.length == 0) {
                othis.common.showMessageView('请选择批量审批项!', 'warning');
                return;
            }
            var title = '批量审批';
            if (type == 1) {
                title = '批量拒绝';
            }
            othis.$modal.show({
                //title: title+`您选择了${str.length}条任务，请输入<span style="color:#FF0000">提交</span>意见`,
                title: title,
                content: BatchSubmit,
                componentParams: {
                    selectedItems: str,
                    batchType: type,
                },
                width: '400px',
                confirmHandler: () => {
                    othis.loadListData(1);
                    othis.$emit('reloadData');
                },
            });
            // DataFormService.batchSubmit(this, type, this.multipleSelected, () => {
            //     othis.loadListData(1);
            //     othis.$emit('reloadData');
            // });
        },
        handleSelectable: function (row) {
            //锁定的流程不允许批量审批
            if (row['IsLock']) {
                return false;
            }
            return true;
        },
    },
};
</script>

<style scoped>
.el-button {
    margin-bottom: 5px;
}
.modal_full_screen_class .data-grid-class {
    height: calc(100% - 80px) !important;
}
</style>
