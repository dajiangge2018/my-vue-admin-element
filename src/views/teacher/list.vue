<template>
  <div class="app-container">

    <!-- 查询表单 --> 
    <el-form :inline="true" class="demo-form-inline">
    <el-form-item >
        <el-input v-model="teacherQuery.name" placeholder="人物名"></el-input>
    </el-form-item>
    <el-form-item >
        <el-select v-model="teacherQuery.level" clearable placeholder="人物品级">
        <el-option  value="1" label="卓越"></el-option>
        <el-option  value="2" label="史诗"></el-option>
        </el-select>
    </el-form-item>

    <el-form-item label="添加时间">
        <el-date-picker type="datetime" placeholder="选择开始时间"
         value-format="yyyy-MM-dd HH:mm:ss"
         default-time="00:00:00"
         v-model="teacherQuery.begin" style="width: 100%;"></el-date-picker>
    </el-form-item>

    <el-form-item>   
        <el-date-picker type="datetime" placeholder="选择截止时间"
         value-format="yyyy-MM-dd HH:mm:ss"
         default-time="00:00:00"
         v-model="teacherQuery.end" style="width: 100%;"></el-date-picker> 
    </el-form-item>


    <el-form-item>
        <el-button type="primary" @click="getList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
    </el-form-item>
    </el-form>
    <!--结果展示-->
      <el-table
      :data="resultList"
      element-loading-text="数据加载中"
      border
      fit
      height-current-row
      style="width: 100%">
      <el-table-column
        label="序号"
        align="center"
        width="70">
        <template slot-scope="scope">
            {{(page -1 ) *limit + scope.$index + 1}}
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="姓名"
        width="80">
      </el-table-column>

      <el-table-column
        prop="level"
        label="品级">
        <template slot-scope="scope">
            {{ scope.row.level ===1?'卓越':'史诗' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="intro"
        label="人物简介">
      </el-table-column>

      <el-table-column
        prop="gmtCreate"
        label="添加时间"
        width="160">
      </el-table-column>

      <el-table-column
        prop="gmtModified"
        label="修改时间"
        width="160">
      </el-table-column>

      <el-table-column
        prop="sort"
        label="排序"
        width="60">
      </el-table-column>

      <el-table-column label="操作" width="210" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          &#8194;&#8194;&#8194;
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        :page-sizes="[5, 10, 20, 50]"
        style="padding:30px 0;text-align:center;"
        layout="total,prev,pager,next,jumper"
        @current-change="getList"
    /> -->

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getList"
      :current-page="page"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="limit"
      style="padding:30px 0;text-align:center;"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>


<script>
//引入调用teacher.js文件
import teacher from '@/api/edu/teacher'
export default {
    //核心代码
    data(){ //定义变量和初始值
        return{
            page:1, //当前页
            limit:5, //每页数
            total:0, //总记录行数
            teacherQuery:{}, //条件对象
            resultList:null //查询后返回的结果集
        }
    },
    created(){ //页面渲染之前执行，一般调用methods定义的方法
        //调用
        this.getList();
    }, 
    methods:{ //创建具体的方法，调用teacher.js中的方法
        //创建讲师列表的方法
        //默认查询第一页
        getList(page =1){
            this.page = page;
            teacher.getTeacherList(this.page,this.limit,this.teacherQuery)
                .then(response => { //请求成功
                    //response 接口返回的数据
                    //console.log(response);
                    this.resultList = response.data.rows;
                    this.total = response.data.total;
                    // console.log(this.resultList);
                    // console.log(this.total);
                })
                .catch(error =>{console.log(error)});//请求失败
        },
        handleSizeChange(val) {
          this.limit = val;
          //调用
          this.getList();
        },
        resetData() {
            this.teacherQuery = {}
            this.getList()
        },
        //删除
        removeDataById(id){
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => { //点击确定，执行then方法
                //确定，调用删除方法
                teacher.deleteTeacherById(id)
                    .then(response =>{ //删除成功
                        //提示信息
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                  //刷新列表
                  this.getList();
                })
            })       
        }

    }

}
</script>

