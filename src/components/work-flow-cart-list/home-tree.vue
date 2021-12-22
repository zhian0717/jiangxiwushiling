<template>
    <div class="home-tree-wrapper" @click.self="$emit('cancel')">
        <div class="home-tree">
            <el-tree ref="tree" class="tree" node-key="Code" :data="treeData" :props="defaultProps"
                :default-expanded-keys="defaultExpandedKeys" :default-checked-keys="defaultCheckedKeys"
                :show-checkbox="true" @check-change="nodeCheckChange"></el-tree>
            <el-row class="button">
                <el-button @click="confirm" type="primary" size="mini">确定</el-button>
                <el-button @click="cancel" size="mini">取消</el-button>
            </el-row>
        </div>
    </div>
</template>

<script>
    import DataFormService from './js/data-form-service';
    export default {
        name: 'home-tree',
        mixins: [DataFormService],
        props: {
            data: {
                type: Array,
            },
            popover: {
                type: Object
            }
        },
        data() {
            return {
                treeData: [],
                defaultExpandedKeys: [],
                defaultCheckedKeys: [],
                defaultProps: {
                    label: 'Name',
                    children: 'Children',
                },
                checkedList: [],
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.DataFormServiceGetAppFunctionItemByFormWorkFlowRole(this).then(r => {
                    this.treeData = r.Result;
                });
            },
            nodeCheckChange() {
                this.checkedList = this.$refs['tree'].getCheckedNodes(true);
            },
            setChecked(key, checked) {
                this.$refs['tree'].setChecked(key, checked);
            },
            confirm() {
                this.$emit('confirm', this.checkedList);
                this.popover && this.popover.doClose();
            },
            cancel() {
                this.$emit('cancel');
                this.popover && this.popover.doClose();
            },
        },
    };
</script>

<style scoped>
    .home-tree-wrapper {
        overflow: auto;
    }

    .home-tree-wrapper .home-tree {
        border: 1px solid #e4e7ed;
        background: #fff;
    }

    .home-tree .tree {
        height: 260px;
        overflow: auto;
    }

    .home-tree .button {
        height: 40px;
        line-height: 40px;
        padding: 0 24px;
        border-top: 1px solid #e4e7ed;
    }
</style>