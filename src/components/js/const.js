const InstanceState = {
    Draft: 0,
    Starting: 1,
    Running: 2,
    Finishing: 3,
    Finished: 4,
    Canceled: 5,
    Exceptional: 6,
    Suspended: 7,
    Unfinished: 8,
    NotCanceled: 9,
    Unspecified: 10,
    Rejected: 11,
    Veto: 12,
};
export default {
    DataFormAction: {
        Close: 0,
        TempSave: 1,
        Submit: 2,
        Delete: 3,
    },
    FormViewType: {
        // 新增
        Add: 'add',
        // 编辑
        Edit: 'edit',
        // 查看
        View: 'view',
        //草稿
        Draft: 'draft',
    },
    AppItemType: {
        // 视图表单
        ViewList: 'ViewList',
        // 工作流表单
        WorkflowList: 'WorkflowList',
        // 普通表单
        GridList: 'GridList',
        // 文件列表
        FileList: 'FileList',
        //外部数据源列表
        ExDatasourceList: 'ExDatasourceList',
        // 树列表
        TreeList: 'TreeList',
        //邮件列表
        MailList: 'MailList',
    },
    ShowState(a) {
        console.log(typeof a);
        switch (a) {
            case InstanceState.Draft:
                return '草稿';
            case InstanceState.Starting:
                return '开始';
            case InstanceState.Running:
                return '进行中';
            case InstanceState.Finishing:
                return '完成中';
            case InstanceState.Finished:
                return '已结束';
            case InstanceState.Canceled:
                return '已取消';
            case InstanceState.Exceptional:
                return '异常';
            case InstanceState.Suspended:
                return '已暂停';
            case InstanceState.Unfinished:
                return '未完成';
            case InstanceState.NotCanceled:
                return '不取消';
            case InstanceState.Unspecified:
                return '未指明';
            case InstanceState.Rejected:
                return '驳回';
            case InstanceState.Veto:
                return '已否决';
            default:
                return '未知';
        }
    },
    IsNull(val) {
        return val === null || val === undefined || val === 'undefined' || val === '';
    },
    CreateUUID() {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'.split('');
        const uuid = [];

        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                const r = 0 | (Math.random() * 16);
                uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
            }
        }

        return uuid.join('');
    },
    Format(date, fmt) {
        if (typeof date == 'string') {
            return date;
        }
        if (!date) date = new Date();
        var o = {
            'M+': date.getMonth() + 1, //月份
            'd+': date.getDate(), //日
            'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
            'H+': date.getHours(), //小时
            'm+': date.getMinutes(), //分
            's+': date.getSeconds(), //秒
            'q+': Math.floor((date.getMonth() + 3) / 3), //季度
            S: date.getMilliseconds(), //毫秒
        };
        var week = {
            '0': '/u65e5',
            '1': '/u4e00',
            '2': '/u4e8c',
            '3': '/u4e09',
            '4': '/u56db',
            '5': '/u4e94',
            '6': '/u516d',
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') +
                    week[date.getDay() + '']
            );
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                );
            }
        }
        return fmt;
    },
};
