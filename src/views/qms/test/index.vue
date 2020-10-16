<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="测验名称：">
            <el-input v-model="listQuery.testName" class="input-width" placeholder="测验名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加测验</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="testTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="测验名称" width="200" align="center">
          <template slot-scope="scope">{{scope.row.testName}}</template>
        </el-table-column>
        <el-table-column label="测验类型" width="200" align="center">
          <template slot-scope="scope">{{scope.row.type }}</template>
        </el-table-column>
        <el-table-column label="创建时间"  align="center">
          <template slot-scope="scope">
            {{scope.row.createTime | formatTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleSelectQuestions(scope.row.id)">分配试题
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="isEdit?'编辑测验':'添加测验'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="test"
               ref="testForm"
               label-width="150px" size="small">
        <el-form-item label="测验名称：">
          <el-input v-model="test.testName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="测验类型：">
          <el-input v-model="test.type" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'测验分配试题'"
      :visible.sync="testDialogVisible"
      width="40%"
      class="dialogClass">
      <hr style="margin: 0 0 20px " align=center width=100% color=#EBEEF5 SIZE=1>
      <el-transfer
        style="text-align: left; display: inline-block;margin-top: 0"
        :titles="['Source', 'Target']"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="搜索题目"
        v-model="chooseQues.value"
        :data="chooseQues.data">
      </el-transfer>
      <span style="margin-left: 50px " >
        <el-button type="primary" @click="handleQuesDialogConfirm()" size="small">点击分配</el-button>
      </span>
      <p style="text-align: left; margin: 20px 0 0">已分配的测验题目:</p>
      <el-table style="width: 100%;margin-top: 20px"
                :data="questions"
                border>
        <el-table-column
          label="题目标题"
          align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column
          label="题目类型"
          width="80"
          align="center">
          <template slot-scope="scope">{{scope.row.type | formatType}}</template>
        </el-table-column>
        <el-table-column
          label="题目等级"
          width="80"
          align="center">
          <template slot-scope="scope">{{scope.row.level | formatLevel}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="80"
          align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="delQuestion(scope.$index,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList,addTestQuestions,createTest,updateTest,delTestQuestions} from '@/api/test';
  import {selectQuesList,selectQuestionsByTestId} from '@/api/question';
  import {formatDate} from '@/utils/date';
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    testName: null,
  };
  const defaultTest = {
    id:null,
    testName: null,
    type: 0,
    createTime: null,
  };
  const defaultChooseQues ={
    data: [],
    value: [],
    volatile: null,
    param : {
      query: '',
      testId: null
    },
  };
  const typeList = [
    {
      id: 1,
      type: "基础"
    },
    {
      id: 5,
      type: "MySQL"
    },
    {
      id: 9,
      type: "GIT"
    },
    {
      id: 7,
      type: "Spring"
    }
  ];
  export default {
    name: 'testList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        test: Object.assign({}, defaultTest),
        listLoading: false,
        multipleSelection: [],
        isEdit: false,
        dialogVisible: false,
        testDialogVisible: false,
        chooseQues : Object.assign({}, defaultChooseQues),
        selectQuesList: [],
        questions:null,
        operates: [
          {
            label: "删除",
            value: 0
          }
        ],
        operateType: null
      }
    },
    created() {
      this.getList();
    },
    filters:{
      formatLevel(level){
        if(level===1){
          return 'D';
        }else if(level===2){
          return 'C';
        }else if(level===3){
          return 'B';
        }else {
          return 'A';
        }
      },
      formatTime(time){
        if(time==null||time===''){
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatType(typeId){
        for(let i=0;i<typeList.length;i++){
          if(typeList[i].id === typeId){
            return typeList[i].type;
          }
        }
      }
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleDelete(index,row){
        this.deleteHomeAdvertise(row.id);
      },
      handleBatchOperate(){
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        if(this.operateType===0){
          //删除
          this.deleteHomeAdvertise(ids);
        }else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
        }
      },
      handleAdd(){
        this.dialogVisible = true;
        this.test = Object.assign({},defaultTest);
      },
      handleUpdate(index,row){
        this.dialogVisible = true;
        this.isEdit = true;
        this.test = Object.assign({},row);
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        })
      },
      deleteHomeAdvertise(ids){
        this.$confirm('是否要删除该广告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params=new URLSearchParams();
          params.append("ids",ids);
        })
      },
      handleSelectQuestions(testId){
        this.chooseQues.volatile = null;
        this.chooseQues.data = [];
        this.chooseQues.value = [];
        this.selectQuesList = [];
        this.chooseQues.param.testId = testId;
        selectQuesList(this.chooseQues.param).then(response =>{
          response.data.forEach((ques,index) =>{
            this.chooseQues.data.push({
              label: ques.title,
              key: index,
              id: ques.id,
              subtitle: ques.subTitle
            });
            this.selectQuesList.push({
              id: ques.id,
            })
          })
        });
        this.selectQuestionsByTestId(testId);
        this.chooseQues.volatile = testId;
        this.testDialogVisible =true;
      },
      selectQuestionsByTestId(id){
        selectQuestionsByTestId(id).then(response =>{
          this.questions = response.data;
        });
      },
      handleDialogConfirm(){
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updateTest(this.test.id,this.test).then(response => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          } else {
            createTest(this.test).then(response => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          }
        })
      },
      filterMethod(query, item){
        return item.subtitle.indexOf(query) > -1;
      },
      handleQuesDialogConfirm(){
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let value =[];
          let len = this.chooseQues.value.length;
          for(let i =0;i<len;i++){
            value.push(this.selectQuesList[this.chooseQues.value[i]].id);
            this.chooseQues.data.splice(this.chooseQues.value[len-i-1],1);
          }
          addTestQuestions(this.chooseQues.volatile,value).then(response =>{
            this.selectQuestionsByTestId(this.chooseQues.volatile);
            this.$message({
              message: '分配题目成功！',
              type: 'success'
            });
            this.chooseQues.value = [];
          });
        })
      },
      delQuestion(index,row) {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            quesId: row.id,
            testId: this.chooseQues.volatile
          };
          delTestQuestions(param).then(response => {
            this.$message({
              message: '删除题目成功！',
              type: 'success'
            });
            this.selectQuestionsByTestId(this.chooseQues.volatile);
          })
        })
      }
    }
  }
</script>
<style>
  .dialogClass .el-dialog__body {
    padding-top: 0;
  }
</style>

<style scoped>
  .input-width {
    width: 203px;
  }
</style>


