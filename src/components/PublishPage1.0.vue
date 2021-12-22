<template>
  <div>
    <!-- 编辑器 -->
    <div style="width:100%;height:100%;border-top:1px solid #E6E6E6;border-bottom:1px solid #E6E6E6;">
      <el-row type="flex">
        <el-col style="width:130px;">
          <span style="width:130px;display:block;height:100%;padding-right:8px;box-sizing: border-box;display: flex;
          justify-content: flex-end;
  align-items: center;
  background: #fafafa;">新闻正文:</span>
        </el-col>
        <el-col :span="22" style="box-sizing: border-box;padding:5px;">
            <div ref="editor" style="width:;">
            </div>
        </el-col>
      </el-row>
    </div>
    <!-- <div>
      <span style="width:10%;">新闻内容:</span>
      
    </div> -->
    <!-- 编辑器 -->

    <!-- 封面上传 -->
    <div style="width:100%;height:100%;border-bottom:1px solid #E6E6E6;">
      <el-row type="flex">
        <el-col style="width:130px;">
          <span style="width:130px;display:block;height:100%;padding-right:8px;box-sizing: border-box;display: flex;
          justify-content: flex-end;
  align-items: center;
  background: #fafafa;">封面内容:</span>
        </el-col>
        <el-col :span="22" style="box-sizing: border-box;padding:5px;">
            <el-upload
              :disabled="isExamSolt"
                v-show="isShow"
                action="#"
                :limit="num"
                list-type="picture-card"
                :before-upload="beforeAvatarUpload"
                :on-change="handleSuccess"
                ref="myUpload11"
                :http-request="modeUpload"
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
                  <el-button type="primary" @click="dialogSure()" element-loading-text="图片上传中" v-loading.fullscreen.lock="loading">确 定</el-button>
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
                <el-button type="primary" @click="handleBtn">编辑完成</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
           
<script>
import E from "wangeditor";
import { VueCropper } from "vue-cropper";
export default {
  name: "PublishPage1",
  props: {
      dataFormRunner: {
        type: Object,
        default: null,
      },
  },
  data() {
    return {
      isExamSolt:false,
      api:{
        api:'',
        java:''
      },
      vueIsView:true,
      loading:false,//图片上传时的加载图标
      mode:{},
      content:"在此输入正文",
      title:'在此输入标题',
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
      mask: false, //对话框遮罩 (本地可以不需要设置,但是在五十铃项目中会很影响);
      // 图文数据(点击编辑完成进行保存上传)
      imgData:{
        imgData:'',
        contentHtml:''
      },
      thumb_media_id:'',
      formViewType:'',//表单状态
      file:'',
    }
  },
  created(){
    console.log(this.dataFormRunner.getDataFormInfo());
    console.log('我是formViewType：')
    this.formViewType = this.dataFormRunner.getDataFormInfo().formViewType;
    console.log(this.dataFormRunner.getDataFormInfo().formViewType);
    this.getApi();
    
    if(this.formViewType == 'view'){
        //禁用推送按钮
        // this.dataFormRunner.getPushDisabled();
        // 禁用上传
        this.isExamSolt = true;
    }else{
      //开启推送按钮
        this.dataFormRunner.getPushAbled();
        this.isExamSolt = false;
    }
    
    
  },
  mounted() {
    //查看状态时
    if(this.formViewType == 'edit'){
        //显示已上传的封面
        this.isShow = false;
        this.previewsUrl = this.dataFormRunner.getDataItemValue('f_23975e32f1');
        // console.log(this.previewsUrl);
        // console.log('我是previewsUrl')
    }
    console.log(this.$refs)
    console.log(this.$refs.editor);
    // this.$refs.editor.innerHTML="";
    this.getNewEditor();
    var that = this;
    var dataForm = this.dataFormRunner;
    console.log('我是dataFormRunner：')
    console.log(this.dataFormRunner);
    this.dataFormRunner.addButtonBefore('推送企业微信', function(resolve){
      // console.log('我是应用：');
      // console.log(dataForm.getDataItemValue('f_989b43b146'));//应用AgentID
      // console.log(dataForm.getDataItemValue('f_1a6aa3a512'));//应用凭证
      // var index = that.editor.txt.html().indexOf('</h1>');
      // var content = that.editor.txt.html().substring(index+5,that.editor.txt.html().length);
      console.log('我是富文本编辑框的所有内容：')
      console.log(that.editor.txt.html());
      console.log('我是标题内容：');
      console.log(dataForm.getDataItemValue('f_31a740306e'))

      if(that.dataFormRunner.getDataItemValue('f_9b3f5020cd')){//图片的媒体id
          that.thumb_media_id = that.dataFormRunner.getDataItemValue('f_9b3f5020cd');
      }
      console.log('我是thumb_media_id');
      console.log(that.thumb_media_id);
      // console.log(content);
        var params = {
          "appObjectId":dataForm.getDataItemValue('f_d3fa3b89fd'),
          "author":dataForm.getDataItemValue('f_6407833ec9'),//作者
          "content":that.editor.txt.html(),//必填
          "content_source_url":"",
          "digest":dataForm.getDataItemValue('f_bb1043f24b'), //摘要
          "thumb_media_id":that.thumb_media_id,//必填
          "title":dataForm.getDataItemValue('f_31a740306e'),//必填 新闻标题
          "toparty":"",//部门id
          "touser":"",//接收成员id
          "topartyList":[],
          "touserList":[]
        };
        console.log('我是正文内容！！！');
        console.log(that.editor.txt.text());
        console.log(params.content)
        if(dataForm.getDataItemValue('f_438cd160da_id') != null){
            params.topartyList = dataForm.getDataItemValue('f_438cd160da_id').split(',');
            //如果选择全公司，传递@all
            // if(dataForm.getDataItemValue('f_438cd160da') == 'isuzu-alluser'){
            //   params.topartyList = ['@all'];
            // }
        }
        if(dataForm.getDataItemValue('f_0ad09843a1_id')){
          params.touserList = dataForm.getDataItemValue('f_0ad09843a1_id').split(',');
        }
        if(that.editor.txt.text() == ''){
            that.$message({
              message: '请填写正文内容！',
              type: 'warning'
            });
        }else if(params.title == '' || params.title == null){
            that.$message({
              message: '请填写标题！',
              type: 'warning'
            });
        }else if(params.thumb_media_id == ''){
            that.$message({
              message: '请正确上传封面！',
              type: 'warning'
            });
        }else if(params.touserList.length == 0 && params.topartyList.length == 0){
            that.$message({
              message: '请选择接收部门或接收人！',
              type: 'warning'
            });
        }else{
            console.log('我要做一些事情！！');
            that.$http.POST(`${that.api.java}/news/publish`,params).then((res)=>{
                console.log('我是推送企业微信的响应：');
                console.log(res);
                if(res.code == 200){
                  resolve();
                  //调用getSave方法
                  dataForm.getSave();
                }
            })
            console.log(params);
            console.log(resolve);
        }
    });
    //保存按钮的前置
    // console.log('dataForm！！')
    // console.log(dataForm);
    dataForm.addButtonBefore('保存', function(resolve){
      //把富文本框里的内容存储到f_62eda3f73c字段里
          dataForm.setDataItemValue('f_62eda3f73c', that.editor.txt.html());
      //把图片的src存储到f_0bd8dee139字段里
      if(that.previewsUrl != ''){
        dataForm.setDataItemValue('f_0bd8dee139', `<img src="${that.previewsUrl}" id="previewImg" style="width: 220px;height: 99px;margin-right: 10px"/>`);
        dataForm.setDataItemValue('f_23975e32f1',that.previewsUrl);
      }
      resolve();
    })
  },
  methods: {
    find(str,cha,num){
      var x=str.indexOf(cha);
      for(var i=0;i<num;i++){
          x=str.indexOf(cha,x+1);
      }
      return x;
    },
    modeUpload(item){
      console.log('我是item');
      console.log(item)
      this.mode = item.file;
    },
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
            if (item.SettingName == "api") {
              this.api.api = item.SettingValue;
            } else if (item.SettingName == "java") {
              this.api.java = item.SettingValue;
            }
          });
          // console.log('我是this.api')
          // console.log(this.api)
        }
      });
    },
    // 新建富文本编辑器
    getNewEditor() {
      this.editor = new E(this.$refs.editor);
      // // 配置触发 onchange 的时间频率，默认为 200ms
      // this.editor.config.onchangeTimeout = 5000; // 修改为 500ms
      // 设置编辑区域高度为 500px
      this.editor.config.height = 350;
      // 取消粘贴样式过滤
      this.editor.config.pasteFilterStyle = false;
      //设置z-index,默认是10000
      this.editor.config.zIndex = 1000;
      this.editor.create(); //创建
      if(this.formViewType == 'edit'){
        //重新设置内容
        if(this.dataFormRunner.getDataItemValue('f_62eda3f73c')){
          this.editor.txt.html(this.dataFormRunner.getDataItemValue('f_62eda3f73c'));
        }
      }
      if(this.formViewType == 'view'){
        this.editor.disable();
      }else{
        this.editor.enable();
      }
      // editor.txt.html('<p>自定义内容</p>') // 重新设置编辑器内容,不添加参数则获取富文本html
    },
    //限制上传文件大小格式
    beforeAvatarUpload(file) {
      // this.file = file;
    },
    //图片上传成功的回调 本on-sucess  没有地址  暂时用on-change代替
    handleSuccess(file) {
      console.log('我在上传！！');
      console.log(file)
      let _this = this;
      this.mode = file;
      this.file = file;
      console.log('我是mode')
      console.log(this.mode)
      //上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(function () {
        // console.log(file, "nextTick中");
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
      let _this=this;
      this.$refs.cropper.startCrop(); //开始截图
      this.dialogVisible = false;
      // 获取截图的base64 数据
      this.$refs.cropper.getCropData(function (data) {
        // url传递给预览图
        _this.previewsUrl = data;
        _this.isShow = false; //添加按钮隐藏,
      });
      // 获取截图的blob数据
      this.$refs.cropper.getCropBlob(function (data) {
        console.log(data,'Blob');
        _this.imgData.imgData=data;
        console.log(window.URL.createObjectURL(data),'读取Blob')
      });
      
      this.getUploadFile();
    },
    // 点击预览图上的删除按钮,清除文件列表
    del() {
      //清除上传文件列表
      this.$refs.myUpload11.clearFiles();
      this.imgData.imgData='';
      this.isShow = true; //添加封面显示,预览图消失
    },
    handleBtn(){
      const contentHtml=this.editor.txt.html();//获取html文本
      this.imgData.contentHtml=contentHtml;
      console.log(this.imgData,'图文数据') 
    },
    //上传文件
    getUploadFile(){
      var that = this;
      let fd = new FormData();
      fd.append('multipartFile', this.mode)
      // 确认封面编辑完成  请求接口获取thumb_media_id
      console.log('我是fd:');
      console.log(fd);
      console.log('我是file');
      console.log(that.file);
      if(that.file.raw.type != 'image/jpeg'){
          that.dialogVisible = false;
          that.$message.error('上传图片只能是 JPG 格式!');
          return false;
      }else if(that.file.raw.size / 1024 / 1024 > 2){
          that.dialogVisible = false;
          that.$message.error('上传图片大小不能超过 5MB!');
          return false;
      }else{
          console.log("我是loading：");
          console.log(this.loading);
          this.loading = true;
          this.$http.POST(`${this.api.java}/news/uploadFile`,fd).then((res)=>{
            console.log('我是file的响应：');
            this.thumb_media_id = res.data;
            that.dataFormRunner.setDataItemValue('f_9b3f5020cd',res.data);
            console.log(res);
            if(res.code == 200){
              console.log("我是loading：");
              console.log(this.loading);
              that.loading = false;
            }
        })
      }
      
    }
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
.form-content .el-row{
  margin: 0;
}

</style>