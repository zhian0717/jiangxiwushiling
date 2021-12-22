<template>
  <div>
    <!-- 编辑器 -->
    <div id="editor">
      <h1>在此输入标题</h1>
      <p>在此输入正文</p>
    </div>
    <!-- 编辑器 -->
    <!-- 封面上传 -->
    <el-upload
      v-show="isShow"
      action="#"
      :limit="num"
      list-type="picture-card"
      :before-upload="beforeAvatarUpload"
      :on-exceed="morePic"
      :auto-upload="false"
      :on-remove="handleRemove"
      :on-change="handleSuccess"
      ref="myUpload11"
    >
      <i class="el-icon-plus">添加封面</i>
      <div class="el-upload__tip" slot="tip">
        只能上传一个jpg文件，且不超过2M!
      </div>
    </el-upload>
    <!-- 封面上传 -->
    <!-- 裁剪区域 -->
    <el-dialog
      top="0"
      :modal="mask"
      :visible.sync="dialogVisible"
      width="650px"
      height="450px"
      title="添加封面"
      append-to-body
    >
      <div class="dialog-content"
      style="text-align: center; height: 500px; width: 500px">
        <div
          class="cropper-image"
          style="text-align: center; height: 450px; width: 500px"
        >
          <vue-cropper
            ref="cropper"
            :img="option.cropImgUrl"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :info="option.info"
            :canScale="option.canScale"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixed="option.fixed"
            :centerBox="option.centerBox"
            :fixedBox="option.fixedBox"
            :fixedNumber="option.fixedNumber"
          ></vue-cropper>
        </div>
        <!-- 图片裁剪之后的预览 -->

        <!-- 裁剪结束 -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEsc()">取 消</el-button>
        <el-button type="primary" @click="dialogSure()">确 定</el-button>
      </span>
    </el-dialog>

    <div v-show="!isShow" id="preview" style="width: 500px;height: 99px;padding:10px 0;"  >
      <img :src="previewsUrl" id="previewImg" style="width: 220px;height: 99px;margin-right: 10px"/>
      <!-- 删除图片确认框 -->
      <!-- <el-popconfirm @confirm="del" title="确定删除此封面图片吗？">
        <span slot="reference" class="delImg" >
          <i class="el-icon-delete"></i>
        </span>
      </el-popconfirm> -->
      <el-button type="warning" icon="el-icon-folder-opened"  @click="del">更换封面</el-button>
    </div>
    <el-button type="primary">编辑完成</el-button>
  </div>
</template>
           
<script>
import E from "wangeditor";
import { VueCropper } from "vue-cropper";
export default {
  name: "PublishPage",
  data() {
    return {
      isShow: true,
      eaitor: null,
      ediotContent: null,
      //上传封面图
      num: 1, //限制上传一个文件
      dialogVisible: false, //裁剪区域是否显示
      //   disabled: false, //是否禁用删除按钮
      // 裁剪组件的基础配置option
      option: {
        cropImgUrl: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "jpeg", // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 440, // 默认生成截图框宽度
        autoCropHeight: 188, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        canMove: true, //被裁剪图片是否可以移动
      },
      previewsUrl: "", //裁剪后图片的url
      mask: false, //对话框遮罩 (本地可以不需要设置,但是在五十铃项目中会很影响)
    };
  },
  mounted() {
    this.getNewEditor();
  },
  methods: {
    // 新建富文本编辑器
    getNewEditor() {
      this.editor = new E("#editor");
      // 编辑器的事件，每次改变会获取其html内容
      this.editor.config.onchange = function (newHtml) {
        console.log("change 之后最新的 html", newHtml);
        //  _this.catchData(_this.editorContent); // 把这个html通过catchData的方法传入父组件
      };
      // 配置触发 onchange 的时间频率，默认为 200ms
      this.editor.config.onchangeTimeout = 5000; // 修改为 500ms
      // 设置编辑区域高度为 500px
      this.editor.config.height = 500;
      // 取消粘贴样式过滤
      // _this.editor.config.pasteFilterStyle = false;
      //设置z-index,默认是10000
      this.editor.config.zIndex = 0;
      this.editor.create(); //创建
      // editor.txt.html('<p>自定义内容</p>') // 重新设置编辑器内容
    },
    //限制上传文件大小格式
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("封面图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("封面图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleRemove(file) {
      console.log(file);
    },
    //morePic 文件超出限制触发
    morePic() {
      this.$message.error("封面图片只能上传 1 张!");
    },
    //图片上传成功的回调 本on-sucess  没有地址  暂时用on-change代替
    handleSuccess(file) {
      let _this = this;
      console.log(file, "你好");
      //上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(function () {
        console.log(file, "nextTick中");
        _this.option.cropImgUrl = window.URL.createObjectURL(file.raw);
        console.log(this.option.cropImgUrl, "裁剪地址");
        _this.dialogVisible = true;
      });
    },
    // 点击取消
    dialogEsc() {
      this.dialogVisible = false;
    },
    //点击确定
    dialogSure() {
      let _this = this;
      this.$refs.cropper.startCrop(); //开始截图
      this.dialogVisible = false;
      // 获取截图的base64 数据
      this.$refs.cropper.getCropData(function (data) {
        // url传递给预览图
        _this.previewsUrl = data;
        _this.isShow = false; //添加按钮隐藏,
        // console.log(data);
      });
      // 获取截图的blob数据
      this.$refs.cropper.getCropBlob(function (data) {
        // do something
        console.log(data);
      });

      //在这个函数中将裁剪后的图片赋值给参数,或者发送给后端
    },
    // 点击预览图上的删除按钮,清除文件列表
    del() {
      //清除上传文件列表
      console.log("11");
      this.$refs.myUpload11.clearFiles();
      console.log("22");
      // console.log(this.$refs)
      this.isShow = true; //添加封面显示,预览图消失
    },
  },
  components: {
    VueCropper,
  },
};
</script>
<style scoped>
.ff {
  text-align: center;
}
</style>