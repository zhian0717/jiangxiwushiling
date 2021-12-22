import Const from './const';
let { FormViewType, AppItemType, IsNull } = Const;
export default {
    methods: {
        
        getCancelableSource() {
            let CancelToken = this.$axios.CancelToken;
            return CancelToken.source();
        },
        DataFormServiceGetDataCount(inAppCode = null) {
            return this.$http.GET(
                inAppCode ? `/api/Workflow/GetWorkCount/${inAppCode}` : '/api/Workflow/GetWorkCount'
            );
        },
        DataFormServiceGetAllBatchProcessingItems(param) {
            return this.$http.POST('/api/Workflow/GetAllBatchProcessingItems', param);
        },
        DataFormServiceGetAppFunctionItemByFormWorkFlowRole() {
            return this.$http.GET(`api/App/GetAppFunctionItemByFormWorkFlowRole`);
        },
        //获取代办信息
        DataFormServiceGetCartUnfinishWorkItems(
            BelongsApp,
            PagingInfo,
            cardType = 0,
            SearchCondition = [],
            extra = {
                cancelable: false,
                source: null,
            }
        ) {
            if (extra && extra.cancelable) {
                extra.source = this.getCancelableSource();
            }
            return this.$http.POST(
                'api/Workflow/CartUnfinishWorkItems',
                {
                    BelongsApp,
                    PagingInfo,
                    cardType,
                    SearchCondition,
                },
                null,
                false,
                extra.source
            );
        },
        //获取已办信息
        DataFormServiceGetCartFinishWorkItems(
            BelongsApp,
            PagingInfo,
            cardType = 0,
            SearchCondition = [],
            extra = {
                cancelable: false,
                source: null,
            }
        ) {
            if (extra && extra.cancelable) {
                extra.source = this.getCancelableSource();
            }
            return this.$http.POST(
                'api/Workflow/CartFinishWorkItems',
                {
                    BelongsApp,
                    PagingInfo,
                    cardType,
                    SearchCondition,
                },
                null,
                false,
                extra.source
            );
        },
        //获取待阅信息
        DataFormServiceGetCartUnfinishCirculateItems(
            BelongsApp,
            PagingInfo,
            cardType = 1,
            SearchCondition = [],
            extra = {
                cancelable: false,
                source: null,
            }
        ) {
            if (extra && extra.cancelable) {
                extra.source = this.getCancelableSource();
            }
            return this.$http.POST(
                'api/Workflow/CartUnfinishCirculateItems',
                {
                    BelongsApp,
                    PagingInfo,
                    cardType,
                    SearchCondition,
                },
                null,
                false,
                extra.source
            );
        },
        //获取已阅信息
        DataFormServiceGetCartFinishCirculateItems(
            BelongsApp,
            PagingInfo,
            cardType = 1,
            SearchCondition = [],
            extra = {
                cancelable: false,
                source: null,
            }
        ) {
            if (extra && extra.cancelable) {
                extra.source = this.getCancelableSource();
            }
            return this.$http.POST(
                'api/Workflow/CartFinishCirculateItems',
                {
                    BelongsApp,
                    PagingInfo,
                    cardType,
                    SearchCondition,
                },
                null,
                false,
                extra.source
            );
        },

        //获取我的申请信息
        DataFormServicegetCartMyApplicationItems(
            // BelongsApp,
            PagingInfo,
            // cardType = 0,
            userId,
            SearchCondition,
            extra = {
                cancelable: false,
                source: null,
            }
        ) {
            if (extra && extra.cancelable) {
                extra.source = this.getCancelableSource();
            }
            if(SearchCondition){
                var endTime = SearchCondition[3].Value;
                var sequenceNo = SearchCondition[1].Value;//流程单号
                var startTime = SearchCondition[2].Value;
                var workFlowCode = SearchCondition[0].Value;
            }
            // console.log('我是SearchCondition')
            // console.log(SearchCondition)
            // console.log('我是api');
            // console.log(this.api);
            return this.$http.POST(
                // 'api/Workflow/CartUnfinishWorkItems', //接口地址
                `${this.api.java}/application/getMyApplication`,
                {
                    // BelongsApp,
                    // PagingInfo,
                    // cardType,
                    // SearchCondition,
                    endTime,
                    pageIndex:PagingInfo.PageIndex,
                    pageSize:PagingInfo.PageSize,
                    sequenceNo,//流程单号
                    startTime,
                    userId,
                    workFlowCode  //流程类别
                },
                null,
                false,
                extra.source
            );
        },


        /// 表单提交
        DataFormServiceSubmitFormData(parameters) {
            return this.$http.POST('api/Form/SaveFormInfo', parameters);
        },
        // 删除表单
        DataFormServiceDeleteFormData(parameters) {
            return this.$http.POST('/api/Form/SaveFormInfo', parameters);
        },
        DataFormServiceCollectionFormData(parameters) {
            return this.$http.POST('/api/Form/SaveFormInfo', parameters);
        },
    },
};
