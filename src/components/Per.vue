<template>
  <div>
    <div id="editor">
      <h1>在此输入标题</h1>
      <p>在此输入正文</p>
    </div>
    <!-- //封面上传 -->
    <!-- 封面上传 action=上传地址 /limit=1  只允许上传一张/ before-upload 限制用户上传的图片格式和大小/:auto-upload="false"是否在选取文件后立即上传-->
    <!-- 此处使用on-change是因为没有地址,无法on-success -->
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

    <!-- 裁剪区域 -->
    <el-dialog
      top="0"
      :modal="mask"
      :visible.sync="dialogVisible"
      width="650px"
      height="450px"
      title="添加封面"
    >
      <div class="dialog-content">
        <div class="cropper-image">
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
    <div v-show="!isShow" class="preview">
      <img :src="previewsUrl" class="previewImg" />
      <!-- 删除图片确认框 -->
      <!-- <el-popconfirm @confirm="del" title="确定删除此封面图片吗？">
        <span slot="reference" class="delImg" >
          <i class="el-icon-delete"></i>
        </span>
      </el-popconfirm> -->
       <span slot="reference" @click="del" class="delImg" >
          <i class="el-icon-delete"></i>
        </span>
    </div>
    <el-button type="primary">编辑完成</el-button>
  </div>
</template>
           
<script>
import E from "wangeditor";
import { VueCropper } from "vue-cropper";
export default {
  name: "per",
  data() {
    return {
      eaitor: null,
      ediotContent: null,
      //上传封面图
      num: 1, //限制上传一个文件
      // isShow: true, //封面上传图是否显示
      //   dialogImageUrl: "", //预览图地址
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
      isShow: true, // true时封面上传显示,预览区域隐藏
      //
    };
  },
  mounted() {
    this.editor = new E("#editor");
    // 编辑器的事件，每次改变会获取其html内容
    this.editor.config.onchange = function (newHtml) {
      console.log("change 之后最新的 html", newHtml);
      //  this.catchData(this.editorContent); // 把这个html通过catchData的方法传入父组件
    };
    // 配置触发 onchange 的时间频率，默认为 200ms
    this.editor.config.onchangeTimeout = 5000; // 修改为 500ms
    // 设置编辑区域高度为 500px
    this.editor.config.height = 500;
    // 取消粘贴样式过滤
    // this.editor.config.pasteFilterStyle = false;
    //设置z-index,默认是10000
    this.editor.config.zIndex = 0;
    this.editor.create(); //创建
    // editor.txt.html('<p>自定义内容</p>') // 重新设置编辑器内容
  },
  methods: {
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
      console.log(file, "你好");
      //上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.cropImgUrl = URL.createObjectURL(file.raw);
        // this.fileinfo = res;
        this.dialogVisible = true;
      });
    },
    // 点击取消
    dialogEsc() {
      this.dialogVisible = false;
    },
    //点击确定
    dialogSure() {
      this.$refs.cropper.startCrop(); //开始截图
      this.dialogVisible = false;
      // 获取截图的base64 数据
      this.$refs.cropper.getCropData((data) => {
        // url传递给预览图
        this.previewsUrl = data;
        this.isShow = false; //添加按钮隐藏,
        // console.log(data);
      });
      // 获取截图的blob数据
      this.$refs.cropper.getCropBlob((data) => {
        // do something
        console.log(data);
      });

      //在这个函数中将裁剪后的图片赋值给参数,或者发送给后端
    },
    // 点击预览图上的删除按钮,清除文件列表
    del() {
      //清除上传文件列表
      console.log('11')
      this.$refs.myUpload11.clearFiles();
      console.log('22')
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
.dialog-content {
  width: 500px;
  height: 500px;
  text-align: center;
}
.cropper-image {
  width: 500px;
  height: 450px;
  text-align: center;
}

/* 预览裁剪后图片 */
.preview {
  position: relative;
  width: 220px;
  height: 99px;
}
.preview .delImg {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 30px;
}
.previewImg {
  width: 100%;
  height: 100%;
}
.preview:hover .previewImg {
  opacity: 0.4;
}
.delImg{
  display: none;
}
.preview:hover .delImg {
  display: block;
}
</style>