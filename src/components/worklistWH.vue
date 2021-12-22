<template>
    <div class="work-flow-cart-list webpart-global">
        <el-tabs class="tabs-header-padding" v-model="activeName">
            <el-tab-pane v-for="item in label" :key="item.active" :label="item.name" :name="item.active">
                <div v-if="showBadge(item.active)" slot="label">
                    {{ item.name }}
                    <span class="bradge">{{ getWorkCountDesc(item.active) }}</span>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div v-if="showTermSubmitBtn" class="term_submit_div">
            <span class="btn" @click="batchSubmit">批量审批</span>
        </div>
        <div style="width: 100%; overflow: hidden">
            <el-row style="padding: 10px 20px" :gutter="10">
                <el-col :span="6" style="display: flex; justify-content: center; align-items: center">
                    <label style="width: 100px">流程类别:</label>
                    <el-popover ref="card-list-popover" placement="top-start" width="480" trigger="click">
                        <home-tree ref="home-tree" :popover="$refs['card-list-popover']"
                            :data="SearchCondition[0].Value.split(',')" @confirm="confirm"></home-tree>

                        <el-input slot="reference" ref="search-process-input" v-model="SelectedName"
                            placeholder="搜索流程类别" @change="searchByCondition($event, 0)">
                            <i slot="suffix" style="cursor: pointer" @click.stop="clearSelectedName"
                                class="el-input__icon el-icon-close"></i>
                        </el-input>
                    </el-popover>
                </el-col>
                <el-col :span="6" style="display: flex; justify-content: center; align-items: center">
                    <label style="width: 100px">流程单号:</label>
                    <el-input @input="searchByCondition($event, 1)" v-model="SearchCondition[1].Value"
                        placeholder="输入流程单号"></el-input>
                </el-col>
                <el-col :span="6" style="display: flex; justify-content: center; align-items: center">
                    <label style="width: 100px">开始时间:</label>
                    <el-date-picker @input="searchByCondition($event, 2)" v-model="StartTime" type="date"
                        placeholder="选择日期"></el-date-picker>
                </el-col>
                <el-col :span="6" style="display: flex; justify-content: center; align-items: center">
                    <label style="width: 100px">结束时间:</label>
                    <el-date-picker @input="searchByCondition($event, 3)" v-model="EndTime" type="date"
                        placeholder="选择日期"></el-date-picker>
                </el-col>
            </el-row>
        </div>

        <div class="webpart-global__body ContentInfo">
            <div v-for="(item, index) in infoBox" :key="index" @click="showDataFormView(item)"
                class="Message_content_box_div">
                <div class="Content_text">
                    <div class="Message_text">
                        <div class="Detailed_information_div">
                            <div class="Detailed_information_examples_div">
                                <div class="Detailed_information_header">
                                    <img style="width: 36px; height: 36px" :src="getIcon(item)" />
                                </div>
                                <div class="Detailed_information">
                                    <div class="Title">{{ item.Title }}</div>
                                    <div class="Approval_div">
                                        <span :class="getColor(item.State)">{{
                                            getState(item.State)
                                        }}</span>
                                    </div>
                                </div>
                                <div class="Detailed_information">
                                    <div class="Originator_div">
                                        发起人：{{ item.OriginatorName }} [{{
                                            item.OriginatorUnitName
                                        }}]
                                    </div>
                                    <div class="Dealing_div">接收时间：{{ item.ReceiveTime }}</div>
                                    <div class="Serial_number">审批编号：{{ item.SequenceNo }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="Detailed_information_div">
                            <div class="Information_operations_div">
                                <div class="Information_operations_text">
                                    <div class="current_handler_class">
                                        <label>当前处理人：</label>
                                        <span v-for="(item, index) in item.Participants" :key="index">
                                            <span :class="
                                                    item.State === 0
                                                        ? 'Unread_personnel'
                                                        : 'Read_personnel'
                                                "></span>
                                            {{ item.ParticipantName }}；
                                        </span>
                                    </div>
                                    <div>
                                        <div class="text" v-html="item.MessageTempletValue">
                                            {{ item.MessageTempletValue }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="infoBox.length === 0" class="blank">暂无数据</div>
            <div v-if="showMore" class="load-more" v-loading="LoadingMore" element-loading-spinner="el-icon-loading">
                <div class="load-more-btn" @click="getMore(activeName)">查看更多</div>
            </div>
        </div>
    </div>
</template>

<script>
    import DataFormService from './js/data-form-service';
    import DataGrid from './data-grid.vue';
    import HomeTree from './home-tree';
    import Const from './js/const';
    let {
        DataFormAction,
        AppItemType,
        FormViewType,
        ShowState,
        IsNull,
        Format
    } = Const;

    export default {
        name: 'workFlowCartlist',
        props: {
            dataFormRunner: {
                type: Object,
                default: null,
            },
            data: Object,
        },
        mixins: [DataFormService],
        components: {
            HomeTree,
        },
        data() {
            return {
                userId:'',
                formParameters: null,
                infoBox: [],
                unFinishWorkCount: 0,
                unFinishCirculateCount: 0,
                label: [{
                        name: '待办',
                        active: 'unFinishWork',
                    },
                    {
                        name: '已办',
                        active: 'finishWork',
                    },
                    {
                        name: '待阅',
                        active: 'unFinishCirculate',
                    },
                    {
                        name: '已阅',
                        active: 'finishCirculate',
                    }, {
                        name: '我的申请', //添加我的申请
                        active: 'myApplication',
                    }
                ],
                activeName: 'unFinishWork',
                IsRead: '',
                BelongsApp: '',
                PagingInfo: {
                    PageIndex: 1,
                    PageSize: 5,
                },
                LoadingMore: false,
                showMore: true,
                SelectedName: '',
                StartTime: '',
                EndTime: '',
                SearchCondition: [{
                        Name: 'WorkFlowCode',
                        Value: '',
                    },
                    {
                        Name: 'SequenceNo',
                        Value: '',
                    },
                    {
                        Name: 'StartTime',
                        Value: '',
                    },
                    {
                        Name: 'EndTime',
                        Value: '',
                    },
                ],
                checkedList: [],
                axiosExtra: {
                    cancelable: true,
                    source: null,
                },
                api:{
                    api:'',
                    java:''
                }
            };
        },

        computed: {
            showTermSubmitBtn() {
                return this.infoBox && this.infoBox.length > 0;
            },
            getFirstValue: {
                get() {
                    return this.SearchCondition[0].Value;
                },
                set(val) {
                    this.SearchCondition[0].Value = val;
                    this.activeTab();
                },
            },
        },

        watch: {
            activeName() {
                this.activeTab();
            },
            unFinishWorkCount(val) {
                console.log('unFinishWorkCount', val);
            },
            getFirstValue(val) {
                this.getFirstValue = val;
            },
            SelectedName: {
                // handler: _.debounce(function (val) {}, 100),
                handler(val) {
                    if (val.trim() === '') {
                        this.checkedList.forEach(({
                            Code
                        }) => {
                            this.$refs['home-tree'].setChecked(Code, false);
                        });
                    } else {
                        let array = val.split(',');
                        let names = this.checkedList.filter((item) => array.includes(item.Name));
                        this.SearchCondition[0].Value = names.map((item) => item.Code).join(',');
                    }
                },
            },
        },

        created() {
            // 获取平台配置的基础路径
            this.getApi();
            console.log('我是API：！！！')
            console.log(this.api);
            // 获取本地存储中的userId
            this.userId = JSON.parse(localStorage.getItem('user-info')).ObjectID;
            console.log(localStorage.getItem('user-info'))
            this.initParams();
            this.getCartUnfinishWorkItems();
            this.getDataCount();
        },
        methods: {
            getApi(){
                let param = {
                    DataCount: 0,
                    PageCount: 0,
                    PageIndex: 1,
                    PageSize: 20,
                };
                this.$http.POST(`api/System/GetCustomSettings`, param).then((res) => {
                    if (res.Code == 200) {
                        res.Result.Datas.forEach((item) => {
                            if(item.SettingName == "api") {
                                this.api.api = item.SettingValue;
                            }else if (item.SettingName == "java") {
                                this.api.java = item.SettingValue;
                            }
                        });
                            // console.log('我是this.api')
                            // console.log(this.api)
                    }
                });
            },
            initParams() {
                if (this.data) {
                    this.BelongsApp = this.data.InAppCode;
                    this.PagingInfo.PageSize = this.data.PageSize;
                }
            },
            //获取待办待阅数量
            getDataCount() {
                this.DataFormServiceGetDataCount(this.BelongsApp).then((res) => {
                    this.unFinishWorkCount = res.Result.UnfinishedWorkItemCount || 0;
                    this.unFinishCirculateCount = res.Result.UnreadWorkItemCount || 0;
                });
            },
            activeTab() {
                switch (this.activeName) {
                    case 'unFinishWork':
                        this.getCartUnfinishWorkItems();
                        this.Loading = false;
                        break;
                    case 'finishWork':
                        this.getCartFinishWorkItems();
                        this.Loading = false;
                        break;
                    case 'unFinishCirculate':
                        this.getCartUnfinishCirculateItems();
                        this.Loading = false;
                        break;
                    case 'finishCirculate':
                        this.getCartFinishCirculateItems();
                        this.Loading = false;
                        break;
                    case 'myApplication': //添加我的申请case
                        this.getCartMyApplicationItems(); //获取我的申请所有内容
                        this.Loading = false;
                        break;
                    default:
                        break;
                }
            },
            getIcon(item) {
                if (IsNull(item.AppIcon)) {
                    return require('./img/others.png');
                } else if (item.AppIconIsUploadIcon) {
                    return this.$apiURL + '/api/Form/DownloadFile/' + item.AppIcon;
                } else {
                    if (item.AppIcon.indexOf('assets') !== -1) {
                        return item.AppIcon;
                    } else {
                        return require('./img/' + item.AppIcon + '.png');
                    }
                }
            },
            getState(item) {
                return ShowState(item);
            },
            getColor(item) {
                if (item === 2) {
                    return 'Approve_icon_yellow';
                } else if (item === 5 || item === 11) {
                    return 'Approve_icon_red';
                } else {
                    return 'Approve_icon_green';
                }
            },
            //查看更多
            getMore(activeName) {
                this.LoadingMore = true;
                switch (activeName) {
                    case 'unFinishWork':
                        this.loadUnfinishWork();
                        this.LoadingMore = false;
                        break;
                    case 'finishWork':
                        this.loadFinishWork();
                        this.LoadingMore = false;
                        break;
                    case 'unFinishCirculate':
                        this.loadUnfinishCirculate();
                        this.LoadingMore = false;
                        break;
                    case 'finishCirculate':
                        this.loadFinishCirculate();
                        this.LoadingMore = false;
                        break;
                    case 'myApplication': //添加我的申请case
                        this.loadMyApplication(); //获取我的申请所有内容
                        this.LoadingMore = false;
                        break;
                    default:
                        break;
                }
            },
            //待办
            getCartUnfinishWorkItems() {
                if (this.axiosExtra.source) {
                    this.axiosExtra.source.cancel('关闭请求');
                    this.axiosExtra.source = null;
                }
                this.infoBox = [];
                this.showMore = false;
                this.PagingInfo.PageIndex = 1;
                this.DataFormServiceGetCartUnfinishWorkItems(
                    this.BelongsApp,
                    this.PagingInfo,
                    0,
                    this.SearchCondition,
                    this.axiosExtra
                ).then((res) => {
                    this.unFinishWorkCount = res.Result.PagerInfo.DataCount;
                    res.Result.Datas.forEach((element) => {
                        if (res.Result.Datas.length >= 5) {
                            this.infoBox.push(element);
                        } else {
                            this.infoBox.push(element);
                        }
                        this.showMore = true;
                    });

                    console.log(this.infoBox);
                });
            },
            loadUnfinishWork() {
                this.Loading = true;
                this.PagingInfo.PageIndex++;
                if (this.axiosExtra.source) {
                    this.axiosExtra.source.cancel('关闭请求');
                    this.axiosExtra.source = null;
                }
                this.DataFormServiceGetCartUnfinishWorkItems(
                    this.BelongsApp,
                    this.PagingInfo,
                    0,
                    this.SearchCondition,
                    this.axiosExtra
                ).then((res) => {
                    res.Result.Datas.forEach((element) => {
                        if (res.Result.PagerInfo.PageIndex === res.Result.PagerInfo.PageCount) {
                            this.infoBox.push(element);
                        } else {
                            this.infoBox.push(element);
                        }
                        this.showMore = true;
                    });
                });
                this.Loading = false;
            },
            //已办
            getCartFinishWorkItems() {
                if (this.axiosExtra.source) {
                    this.axiosExtra.source.cancel('关闭请求');
                    this.axiosExtra.source = null;
                }
                this.infoBox = [];
                this.showMore = false;
                this.PagingInfo.PageIndex = 1;
                this.DataFormServiceGetCartFinishWorkItems(
                    this.BelongsApp,
                    this.PagingInfo,
                    0,
                    this.SearchCondition,
                    this.axiosExtra
                ).then((res) => {
                    // if (!res.Success) {
                    //     return;
                    // }
                    res.Result.Datas.forEach((element) => {
                        if (res.Result.Datas.length >= 5) {
                            this.infoBox.push(element);
                        } else {
                            this.infoBox.push(element);
                        }
                        this.showMore = true;
                    });
                });
            },
            loadFinishWork() {
                if (this.axiosExtra.source) {
                    this.axiosExtra.source.cancel('关闭请求');
                    this.axiosExtra.source = null;
                }
                this.showMore = false;
                this.Loading = true;
                this.PagingInfo.PageIndex++;
                this.DataFormServiceGetCartFinishWorkItems(
                    this.BelongsApp,
                    this.PagingInfo,
                    0,
                    this.SearchCondition,
                    this.axiosExtra
                ).then((res) => {
                    // if (!res.Success) {
                    //     return;
                    // }
                    res.Result.Datas.forEach((element) => {
                        if (res.Result.PagerInfo.PageIndex === res.Result.PagerInfo.PageCount) {
                            this.infoBox.push(element);
                        } else {
                            this.infoBox.push(element);
                        }
                        this.showMore = true;
                    });
                });
                this.Loading = false;
            },
            //待阅
            getCartUnfinishCirculateItems() {
                if (this.axiosExtra.source) {
                    this.axiosExtra.source.cancel('关闭请求');
                    this.axiosExtra.source = null;
                }
                this.infoBox = [];
                this.showMore = false;
                this.PagingInfo.PageIndex = 1;
                this.DataFormServiceGetCartUnfinishCirculateItems(
                    this.BelongsApp,
                    this.PagingInfo,
                    1,
                    this.SearchCondition,
                    this.axiosExtra
                ).then((res) => {
                    // if (!res.Success) {
                    //     return;
                    // }
                    this.unFinishCirculateCount =
                        res.Result.PagerInfo.DataCount > 99 ? '99+' : res.Result.PagerInfo.DataCount;
                    res.Result.Datas.forEach((element) => {
                        if (res.Result.Datas.length >= 5) {
                            this.infoBox.push(element);
                        } else {
                            this.infoBox.push(element);
                        }
                        this.showMore = true;
                    });
                });
            },
            loadUnfinishCirculate() {
                if (this.axiosExtra.source) {
                    this.axiosExtra.source.cancel('关闭请求');
                    this.axiosExtra.source = null;
                }
                this.Loading = true;
                this.PagingInfo.PageIndex++;
                this.DataFormServiceGetCartUnfinishCirculateItems(
                    this.BelongsApp,
                    this.PagingInfo,
                    1,
                    this.SearchCondition,
                    this.axiosExtra
                ).then((res) => {
                    // if (!res.Success) {
                    //     return;
                    // }
                    res.Result.Datas.forEach((element) => {
                        if (res.Result.PagerInfo.PageIndex === res.Result.PagerInfo.PageCount) {
                            this.infoBox.push(element);
                        } else {
                            this.infoBox.push(element);
                        }
                        this.showMore = true;
                    });
                });
                this.Loading = false;
            },
            //已阅
            getCartFinishCirculateItems() {
                if (this.axiosExtra.source) {
                    this.axiosExtra.source.cancel('关闭请求');
                    this.axiosExtra.source = null;
                }
                this.infoBox = [];
                this.showMore = false;
                this.PagingInfo.PageIndex = 1;
                this.DataFormServiceGetCartFinishCirculateItems(
                    this.BelongsApp,
                    this.PagingInfo,
                    1,
                    this.SearchCondition
                ).then((res) => {
                    // if (!res.Success) {
                    //     return;
                    // }
                    res.Result.Datas.forEach((element) => {
                        if (res.Result.Datas.length >= 5) {
                            this.infoBox.push(element);
                        } else {
                            this.infoBox.push(element);
                        }
                        this.showMore = true;
                    });
                });
            },
            loadFinishCirculate() {
                this.Loading = true;
                this.PagingInfo.PageIndex++;
                if (this.axiosExtra.source) {
                    this.axiosExtra.source.cancel('关闭请求');
                    this.axiosExtra.source = null;
                }
                this.DataFormServiceGetCartFinishCirculateItems(
                    this.BelongsApp,
                    this.PagingInfo,
                    1,
                    this.SearchCondition
                ).then((res) => {
                    // if (!res.Success) {
                    //     return;
                    // }
                    res.Result.Datas.forEach((element) => {
                        if (res.Result.PagerInfo.PageIndex === res.Result.PagerInfo.PageCount) {
                            this.infoBox.push(element);
                        } else {
                            this.infoBox.push(element);
                        }
                        this.showMore = true;
                    });
                });
                this.Loading = false;
            },
            batchSubmit() {
                var othis = this;
                this.$modal.show({
                    title: '批量审批',
                    content: DataGrid,
                    width: '900px',
                    height: '400px',
                    showFooter: false,
                    showScreenBtn: true,
                    componentParams: {
                        searchCondition: this.SearchCondition,
                        belongsApp: this.BelongsApp,
                    },
                    componentOn: {
                        reloadData: () => {
                            othis.getCartUnfinishWorkItems();
                        },
                    },
                });
            },

            //我的申请
            getCartMyApplicationItems() {
                // this.getApi();
                if (this.axiosExtra.source) {
                    this.axiosExtra.source.cancel('关闭请求');
                    this.axiosExtra.source = null;
                }
                this.infoBox = [];
                this.showMore = false;
                this.PagingInfo.PageIndex = 1;
                this.DataFormServicegetCartMyApplicationItems(
                    // this.BelongsApp,
                    this.PagingInfo,
                    this.userId,
                    // 0,
                    this.SearchCondition,
                    this.axiosExtra
                ).then((res) => {
                    // this.unFinishWorkCount = res.Result.PagerInfo.DataCount;
                    // res.Result.Datas.forEach((element) => {
                    //     if (res.Result.Datas.length >= 5) {
                    //         this.infoBox.push(element);
                    //     } else {
                    //         this.infoBox.push(element);
                    //     }
                    //     this.showMore = true;
                    // });
                    res.data.list.forEach((element) => {
                        if (res.data.list.length >= 5) {
                            this.infoBox.push(element);
                        } else {
                            this.infoBox.push(element);
                        }
                        this.showMore = true;
                    });
                    // console.log('我是infobox：')
                    // console.log(this.infoBox);
                });
            },
            loadMyApplication() {
                this.PagingInfo.PageIndex++;
                if (this.axiosExtra.source) {
                    this.axiosExtra.source.cancel('关闭请求');
                    this.axiosExtra.source = null;
                }
                this.Loading = true;
                this.DataFormServicegetCartMyApplicationItems(
                    // this.BelongsApp,
                    this.PagingInfo,
                    this.userId,
                    this.SearchCondition,
                    this.axiosExtra
                ).then((res) => {
                    res.data.list.forEach((element) => {
                        // if (res.Result.PagerInfo.PageIndex === res.Result.PagerInfo.PageCount) {
                        //     this.infoBox.push(element);
                        // } else {
                        //     this.infoBox.push(element);
                        // }
                        this.infoBox.push(element);
                    });
                    if(res.data.list.length > 0){
                        this.showMore = true;
                    }else{
                        this.showMore = false;
                    };
                });
                this.Loading = false;
                console.log('我是loading'+this.Loading);
                console.log('我是showmore'+this.showMore)
            },

            //行点击
            showDataFormView(item) {
                var cardType = 0; //待办/已办
                //待阅/已阅
                if (this.activeName == 'unFinishCirculate' || this.activeName == 'finishCirculate') {
                    cardType = 1;
                }
                let parameters = {
                    formCode: item.WorkFlowCode,
                    dataId: item.DataId,
                    flowId: item.FlowId,
                    appItemType: AppItemType.WorkflowList,
                    cardType: cardType,
                    formViewType: this.activeName === 'unFinishWork' ? FormViewType.Edit : FormViewType.View,
                };
                this.$quickModal.showFormModal(parameters, (res) => {
                    //根据当前卡片tab取加载
                    switch (this.activeName) {
                        case 'unFinishWork':
                            this.getCartUnfinishWorkItems();
                            break;
                        case 'finishWork':
                            this.getCartFinishWorkItems();
                            break;
                        case 'unFinishCirculate':
                            this.getCartUnfinishCirculateItems();
                            break;
                        case 'finishCirculate':
                            this.getCartFinishCirculateItems();
                            break;
                        case 'myApplication': //添加我的申请case
                            this.getCartMyApplicationItems(); //获取我的申请所有内容
                            break;
                        default:
                            break;
                    }
                });
            },
            showBadge(activeName) {
                const workCount = this.getWorkCount(activeName);
                return (
                    (activeName === 'unFinishWork' || activeName == 'unFinishCirculate') &&
                    workCount > 0
                );
            },
            getWorkCount(activeName) {
                if (activeName === 'unFinishWork') {
                    return this.unFinishWorkCount;
                } else if (activeName == 'unFinishCirculate') {
                    return this.unFinishCirculateCount;
                } else {
                    return 0;
                }
            },
            getWorkCountDesc(activeName) {
                const workCount = this.getWorkCount(activeName);
                return workCount > 99 ? '99+' : workCount;
            },
            confirm(data = []) {
                this.SearchCondition[0].Value = data.map(({
                    Code
                }) => Code).join(',');
                this.SelectedName = data.map(({
                    Name
                }) => Name).join(',');
                this.checkedList = data;
            },
            searchByCondition(val, sign) {
                val = Format(val, 'yyyy-MM-dd');
                switch (sign) {
                    case 0:
                        this.SearchCondition[0].Value = val;
                        break;
                    case 1:
                        this.SearchCondition[1].Value = val;
                        break;
                    case 2:
                        this.SearchCondition[2].Value = val;
                        break;
                    case 3:
                        this.SearchCondition[3].Value = val;
                        break;
                }
                this.activeTab();
            },
            // searchByCondition: _.debounce(function (val, sign) {}, 500),
            clearSelectedName() {
                this.SelectedName = '';
                this.SearchCondition[0].Value = '';
                this.activeTab();
            },
        },
    };
</script>
<style scoped>
    .webpart-global {
        position: relative;
        box-sizing: content-box;
    }

    .bradge {
        background-color: #f56c6c;
        border-radius: 10px;
        color: #fff;
        display: inline-block;
        font-size: 12px;
        height: 18px;
        line-height: 18px;
        padding: 0 6px;
        text-align: center;
        white-space: nowrap;
        border: 1px solid #fff;
    }

    .ContentInfo {
        overflow: auto;
        padding-bottom: 50px;
        top: 84px;
    }

    .Message_text {
        overflow: hidden;
    }

    .ContentInfo .Message_content_box_div {
        overflow: hidden;
        padding: 0 0 10px 0;
        border-bottom: 1px solid #eee;
    }

    .ContentInfo .Message_content_box_div:hover {
        background: #f4f8fe;
        cursor: pointer;
    }

    .Message_content_box_div .Content_text {
        overflow: hidden;
        margin: 10px 10px 0 10px;
    }

    .Information_operations_text .Read_personnel {
        background: url(./img/Read_personnel.png) no-repeat 0 center;
        padding: 0 0 0 16px;
        /* margin: 0 5px 0 0; */
    }

    .Information_operations_text .Unread_personnel {
        background: url(./img/Unread_personnel.png) no-repeat 0 center;
        padding: 0 0 0 16px;
    }

    .Detailed_information .Approval_div {
        float: right;
        -webkit-border-radius: 3px;
        border-radius: 3px;
        margin: 10px 10px 0 0;
        padding: 1px 5px;
        color: #fff;
        font-weight: lighter;
    }

    .Detailed_information .Approval_div span {
        font-size: 12px;
        padding: 2px 4px;
        border-radius: 6px;
    }

    .Detailed_information .Approve_icon_green {
        background: #21ba45;
    }

    .Detailed_information .Approve_icon_yellow {
        background: #fbbd08;
    }

    .Detailed_information .Approve_icon_red {
        background: #f2711c;
    }

    .Content_text .Head_portrait {
        float: left;
        width: 45px;
        height: 45px;
        line-height: 45px;
        margin: 10px 20px 0 20px;
    }

    .Content_text .Head_portrait img {
        width: 40px;
        height: 40px;
        border-radius: 60px;
    }

    .Message_text .Dealing_div {
        overflow: hidden;
        color: #757575;
        float: left;
        font-size: 13px;
        margin: 0 0 0 10px;
        padding: 0 0 0 0;
    }

    .Detailed_information .Serial_number {
        float: right;
        margin: 0 15px 0 0;
        color: #323232;
        font-size: 12px;
    }

    .Detailed_information .Originator_div {
        float: left;
        margin: 1px 0 0 0;
        color: #323232;
        font-size: 12px;
    }

    .Message_text .Detailed_information_div {
        overflow: hidden;
    }

    .Message_text .Information_operations_div {
        overflow: hidden;
        margin: 0;
    }

    .Information_operations_div .Information_operations_text {
        margin-bottom: 0;
        padding-bottom: 0;
        margin: 0 0 0 68px;
        overflow: hidden;
        line-height: 22px;
        font-size: 12px;
        padding: 0 0 10px 0;
        color: #323232;
        word-wrap: break-word;
    }

    .Information_operations_text .View_more_div {
        overflow: hidden;
        margin: 5px 0 0 0;
    }

    .Information_operations_text label {
        color: #000;
        margin: 0 0 0 0;
    }

    .Information_operations_text .Title .Approve_icon_green {
        background: #0078d7;
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 10px;
        margin: 0 5px 1px 0;
    }

    .Detailed_information_examples_div {
        padding: 0;
        cursor: pointer;
        overflow: hidden;
        border-radius: 2px;
    }

    .Detailed_information_examples_div:hover {
        color: #000;
    }

    .Detailed_information_examples_div .Detailed_information {
        width: auto;
        overflow: hidden;
    }

    .Detailed_information .Title {
        margin: 15px 0 0 0;
        color: #16263c;
        font-size: 14px;
        float: left;
        font-weight: bold;
    }

    .Detailed_information_examples_div .Detailed_information_header {
        left: 0px;
        top: 0;
        margin: 15px;
        text-align: center;
        border-radius: 50%;
        background: #fff;
        width: 36px;
        height: 36px;
        line-height: 36px;
        overflow: hidden;
        float: left;
    }

    .Detailed_information_header img {
        border-radius: 50%;
        width: 36px;
        height: 36px;
    }

    .Detailed_information_examples_div .title {
        float: left;
        color: #444;
        padding-top: 10px;
        height: 18px;
        line-height: 18px;
    }

    .blank {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
        font-size: 30px;
        font-weight: bolder;
        color: #e1e1e1;
    }

    .work-flow-cart-list .term_submit_div {
        cursor: pointer;
        position: absolute;
        top: 5px;
        right: 5px;
        width: 100px;
        height: 30px;
        z-index: 2;
    }

   .work-flow-cart-list /deep/ .term_submit_div .btn {
        float: right;
        color: #fff;
        border-radius: 4px;
        padding: 2px 5px;
        cursor: pointer;
        margin-right: 20px;
        margin-top: 5px;
        background-color: #77b8ff;
    }

    .work-flow-cart-list {
        overflow: auto;
        height: 100%;
    }

    .work-flow-cart-list .el-tabs .el-tabs__nav-wrap {
        padding-right: 100px !important;
    }

    .load-more {
        font-size: 14px;
    }

    .load-more-btn {
        border: 1px solid #fff;
        border-radius: 6px;
        padding: 6px;
        width: 100px;
        margin: 5px auto;
        cursor: pointer;
        text-align: center;
    }
</style>