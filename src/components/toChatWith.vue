<template>
    <div>
        <button @click="handle">点击触发滚动</button>
        <div class="box" @scroll="scrollEvent">
            <div>12</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
            <div>1111111111</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                oldHeight: 0
            }
        },
        mounted() {},
        methods: {
            scTo() {
                this.$nextTick(function () {
                    var container = this.$el.querySelector(".box");
                    // container.scrollTop = this.oldHeight;
                    container.scrollTop = container.scrollHeight; //wh
                });
            },
            scrollEvent(e) {
                let _this = this;
                if (e === true || (e && e.srcElement.scrollTop <= 10)) {
                    console.log(e, '第一个if') //wh
                    if (e !== true) {
                        console.log(e, 'event !== true的if') //wh
                        _this.oldHeight = e.srcElement.clientHeight;
                    }
                    _this.scTo();
                }
            },
            handle() {
                console.log('dianji')
                this.scrollEvent(true)
            }
        },

    }
</script>
<style scoped>
   .box {
        width: 200px;
        height: 100%;
        overflow-y: auto;
    }
    .box div {
        font-size:40px;
    }
</style>