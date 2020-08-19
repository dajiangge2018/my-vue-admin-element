import request from '@/utils/request'

export default{
//1.讲师列表
//curent 当前页 limit每页记录数 teacherQuery条件对象
getTeacherList(current,limit,teacherQuery){
    return request({
        //url: '/eduservice/teacher/pageTeacherCondition/'+current+"/" + limit,
        url:`/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
        method: 'post',
        //teacherQuery条件对象，后端使用RequestBody获取数据
        //data表示把对象转换成json传到后端接口里面
        data:teacherQuery
      })
}

}