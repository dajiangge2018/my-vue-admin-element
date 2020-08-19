<template>
  <div class="app-container">

    <!-- 查询表单 --> 
    <el-form :inline="true" class="demo-form-inline">
    <el-form-item >
        <el-input v-model="teacherQuery.name" placeholder="讲师名"></el-input>
    </el-form-item>
    <el-form-item >
        <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
        <el-option  value="1" label="高级讲师"></el-option>
        <el-option  value="2" label="首席讲师"></el-option>
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
        label="头衔">
        <template slot-scope="scope">
            {{ scope.row.level ===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="intro"
        label="资历">
      </el-table-column>

      <el-table-column
        prop="gmtCreate"
        label="添加时间"
        width="160">
      </el-table-column>

      <el-table-column
        prop="sort"
        label="排序"
        width="60">
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        style="padding:30px 0;text-align:center;"
        layout="total,prev,pager,next,jumper"
        @current-change="getList"
    />

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
            limit:10, //每页书
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
                    console.log(this.resultList);
                    console.log(this.total);
                })
                .catch(error =>{console.log(error)});//请求失败
        },
        resetData() {
            this.teacherQuery = {}
            this.getList()
  }
    }

}
</script>

