<template>
    <div class="milestone">
        <!-- 左侧里程碑页面 -->
        <div class="left">
            <el-timeline>
                <!-- <li v-for="(item,index) in dataList" :key="index"> -->
                <el-timeline-item v-for="(item,index) in dataList" :key="index" timestamp="2021年1月11日" placement="top">
                    <div class="left-item">
                        <ul>
                            <li>{{item.stepOne.time}}
                                <span>{{item.stepOne.person}}:</span><span>{{item.stepOne.text}}</span></li>
                            <li>{{item.stepTwo.time}}
                                <span>{{item.stepTwo.person}}:</span><span>{{item.stepTwo.text}}</span></li>
                            <li>{{item.stepThree.time}}
                                <span>{{item.stepThree.person}}:</span><span>{{item.stepThree.text}}</span></li>
                            <li>{{item.stepFour.time}} <span>{{item.stepFour.person}}:</span><img
                                    style="width:60px;height:60px;" :src="item.stepFour.imgUrl" alt=""></li>
                        </ul>
                    </div>
                    <!-- </li> -->
                </el-timeline-item>
            </el-timeline>
        </div>
        <!-- 右侧组织成员及事件详细 -->
        <div class="right">
            <div style="height: 60px;font-size:18px;line-height:60px;padding-left:20px"><span
                    style="color: #929292;font-size:14px">本事件持续时间</span> {{echartsData.HoldTime}}</div>
            <div class="event-time">
                <div class="event-time-item">
                    <span>事件开始时间</span>
                    <div>{{echartsData.startTime?echartsData.startTime:'未开始'}}</div>
                </div>
                <div class="event-time-item">
                    <span>事件结束时间</span>
                    <div>{{echartsData.endTime}}</div>
                </div>
            </div>
            <button @click="handle">模拟</button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dataList: [{
                    bigDate: '2021年1月11日',
                    stepOne: {
                        time: '10:33:16',
                        person: '张益同',
                        text: '请治安、技侦、宜昌公安协办稳控涉稳人员'
                    },
                    stepTwo: {
                        time: '10:33:16',
                        person: '魏承责',
                        text: '5名宜昌籍人员已经全部稳控在当地。'
                    },
                    stepThree: {
                        time: '10:33:16',
                        person: '陈明',
                        text: '请技侦部门同志协助追踪以下人员轨迹：王爱华， 420502197110163333;王爱华， 420502197110163333;王爱华， 420502197110163333;王爱华， 420502197110163333;王爱华， 420502197110163333;王爱华， 420502197110163333;'
                    },
                    stepFour: {
                        time: '10:33:16',
                        person: '朱铁',
                        imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ftva3.sinaimg.cn%2Fcrop.1.74.698.698.1024%2F005EkNQ2gw1ei0svbk1d4j30ji0m8n3c.jpg&refer=http%3A%2F%2Ftva3.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1617158863&t=de5ca8d680b2f982c1e847d97928f78b'
                    }
                }, {
                    bigDate: '2021年1月11日',
                    stepOne: {
                        time: '10:33:16',
                        person: '张益同',
                        text: '请治安、技侦、宜昌公安协办稳控涉稳人员'
                    },
                    stepTwo: {
                        time: '10:33:16',
                        person: '魏承责',
                        text: '5名宜昌籍人员已经全部稳控在当地。'
                    },
                    stepThree: {
                        time: '10:33:16',
                        person: '陈明',
                        text: '请技侦部门同志协助追踪以下人员轨迹：王爱华， 420502197110163333;王爱华， 420502197110163333;王爱华， 420502197110163333;王爱华， 420502197110163333;王爱华， 420502197110163333;王爱华， 420502197110163333;'
                    },
                    stepFour: {
                        time: '10:33:16',
                        person: '朱铁',
                        imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ftva3.sinaimg.cn%2Fcrop.1.74.698.698.1024%2F005EkNQ2gw1ei0svbk1d4j30ji0m8n3c.jpg&refer=http%3A%2F%2Ftva3.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1617158863&t=de5ca8d680b2f982c1e847d97928f78b'
                    }
                }, {
                    bigDate: '2021年1月11日',
                    stepOne: {
                        time: '10:33:16',
                        person: '张益同',
                        text: '请治安、技侦、宜昌公安协办稳控涉稳人员'
                    },
                    stepTwo: {
                        time: '10:33:16',
                        person: '魏承责',
                        text: '5名宜昌籍人员已经全部稳控在当地。'
                    },
                    stepThree: {
                        time: '10:33:16',
                        person: '陈明',
                        text: '请技侦部门同志协助追踪以下人员轨迹：王爱华， 420502197110163333;王爱华， 420502197110163333;王爱华， 420502197110163333;王爱华， 420502197110163333;王爱华， 420502197110163333;王爱华， 420502197110163333;'
                    },
                    stepFour: {
                        time: '10:33:16',
                        person: '朱铁',
                        imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ftva3.sinaimg.cn%2Fcrop.1.74.698.698.1024%2F005EkNQ2gw1ei0svbk1d4j30ji0m8n3c.jpg&refer=http%3A%2F%2Ftva3.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1617158863&t=de5ca8d680b2f982c1e847d97928f78b'
                    }
                }],
                echartsData: {}
            }
        },
        mounted() {},
        methods: {
            handle() {
                new Promise(function (resolve, reject) {
                    resolve();
                }).then(()=>{
                    
                })
                this.echartsData = {
                    startTime: '2021年1月11日 21:21:21'
                }
            }
        },

    }
</script>
<style scoped>
    .milestone {
        display: flex;
    }

    .milestone .right {
        width: 300px;
        height: auto;
    }

    /* .left-item {
        border-left: 1px solid #ccc;
    } */

    li {
        text-align: left;
        vertical-align: middle;
    }
</style>