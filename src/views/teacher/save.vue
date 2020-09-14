<template>
  <div class="app-container">
    <el-form label-width="120px">

      <el-form-item label="人物名">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="排序">
         <el-input-number v-model="teacher.sort" controls-position="right" @change="handleChange" :min="0" :max="10"></el-input-number>
      </el-form-item>
      <el-form-item label="头衔">

        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="卓越"/>
          <el-option :value="2" label="史诗"/>
        </el-select>
      </el-form-item>
      <el-form-item label="人物资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="人物简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="头像">

          <!-- 头像缩略图 -->
          <pan-thumb :image="teacher.avatar"/>
          <!-- 文件上传按钮 -->
          <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
          </el-button>

          <!--
          v-show：是否显示上传组件
          :key：类似于id，如果一个页面多个图片上传控件，可以做区分
          :url：后台上传的url地址
          @close：关闭上传组件
          @crop-upload-success：上传成功后的回调 
            <input type="file" name="file"/>
          -->
          <image-cropper
                        v-show="imagecropperShow"
                        :width="300"
                        :height="300"
                        :key="imagecropperKey"
                        :url="VUE_APP_BASE_API+'/eduoss/fileoss'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  components: { ImageCropper, PanThumb },

    data() {
        return {
        teacher: {
            name: '',
            sort: 0,
            level: 1,
            career: '',
            intro: '',
            avatar: ''
        },
        //上传弹框组件是否显示
        imagecropperShow:false,
        imagecropperKey:0,//上传组件key值
        VUE_APP_BASE_API:process.env.VUE_APP_BASE_API, //获取dev.env.js里面地址

        saveBtnDisabled: false // 保存按钮是否禁用,
        }
    },
    created(){ //页面渲染前调用
        this.init();
    },
    watch:{
      //监听，路由发生变化就会执行
      $route(to,from){ 
        this.init();
      }
    },
    methods: {
        close() { //关闭上传弹框的方法
          this.imagecropperShow=false
          //上传组件初始化
          this.imagecropperKey = this.imagecropperKey+1
        },
        //上传成功方法
        cropSuccess(data) {
          this.imagecropperShow=false
          //上传之后接口返回图片地址
          this.teacher.avatar = data.url
          this.imagecropperKey = this.imagecropperKey+1
        },
        init(){
           //路由的参数中存在id，说明是修改，需要调用回显
          if (this.$route.params && this.$route.params.id) {
              const id = this.$route.params.id
              this.getInfo(id);
            }else{
              //路径中没有id值，说明是做的添加操作，需要清空表单
              this.teacher ={}
            }
        },
        //根据id查询，回显功能
        getInfo(id){
            teacherApi.getTeacherInfoById(id)
                .then(response =>{
                    this.teacher = response.data.teacher;
                });
        },

        handleChange(value){
          this.teacher.sort=value;
          //console.log(value);
        },
        saveOrUpdate() {
            this.saveBtnDisabled = true
            //根据teacher中是否有id，来判断是更新还是保存
            if (!this.teacher.id) {
                this.saveTeacher()
            } else {
                this.updateTeacher()
            }
        },
        updateTeacher(){
            teacherApi.updateTeacherById(this.teacher)
                .then(response =>{
                    //修改成功
                    //提示信息
                    this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });

                    //返回列表页面  路由跳转
                    this.$router.push({path:'/teacher/table'});
                })
        },
        // 保存
        saveTeacher() {
            teacherApi.addTeacher(this.teacher)
                .then(response =>{
                    //添加成功
                    //提示信息
                    this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });

                    //返回列表页面  路由跳转
                    this.$router.push({path:'/teacher/table'});
                })
                
        }
    }
}

</script>