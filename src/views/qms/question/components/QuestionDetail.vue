<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="question"
             :rules="rules"
             ref="questionFrom"
             label-width="150px"
             size="small">
      <el-form-item label="题目标题：" prop="title">
        <el-input v-model="question.title" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="副标题：">
        <el-input v-model="question.subTitle" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="题目正确答案：" >
        <el-input v-model="question.answer" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="题目所有答案：" >
        <el-button size="mini" class="btn-add" @click="answerAdd()">添加试题答案</el-button>
          <el-table style="width: 100%;margin-top: 20px"
                    :data="question.answerList"
                    border>
            <el-table-column
              label="题目答案"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.answer"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="题目类型"
              width="80"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.type"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="head"
              width="80"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.answerHead"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="80"
              align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="delAnswer(scope.$index)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-form-item>
      <el-form-item label="题目等级：">
        <el-select v-model="question.level">
          <el-option
            v-for="type in typeOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上线/下线：">
        <el-radio-group v-model="question.enable">
          <el-radio :label="false">下线</el-radio>
          <el-radio :label="true">上线</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="question.displayOrder" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="题目类型：">
        <el-select v-model="question.type"
                   placeholder="请选择类型">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.type"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('questionFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('questionFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import SingleUpload from '@/components/Upload/singleUpload'
  import {createQuestion, getQuestionAnswerVO, updateQuestion} from '@/api/question'
  import {listAll} from '@/api/questionType'
  const defaultTypeOptions = [
    {
      label: 'A',
      value: 4
    },
    {
      label: 'B',
      value: 3
    },
    {
      label: 'C',
      value: 2
    },
    {
      label: 'D',
      value: 1
    }
  ];
  const defaultQuestion = {
    title: '',
    type: 1,
    answer: null,
    level: 1,
    subTitle: null,
    status: 0,
    enable: true,
    displayOrder: 0,
    answerList: null
  };
  export default {
    name: 'QuestionDetail',
    components:{SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        question: Object.assign({}, defaultQuestion),
        rules: {
          title: [
            {required: true, message: '请输入题目标题', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ]
        },
        typeOptions: Object.assign({}, defaultTypeOptions),
        typeList: {},
        defaultAnwserList: [
          { answer: '',
            type: 0,
            answerHead: 'A'
          },
          { answer: '',
            type: 0,
            answerHead: 'B'
          },
          { answer: '',
            type: 0,
            answerHead: 'C'
          },
          { answer: '',
            type: 0,
            answerHead: 'D'
          }
        ],
        answer: {
          answer: '',
          type: '',
          answerHead: ''
        }
      }
    },
    created(){
      listAll().then(response =>{
        this.typeList = response.data;
      });
      if (this.isEdit) {
        getQuestionAnswerVO(this.$route.query.id).then(response => {
          this.question = response.data;
        });
      }else{
        this.question = Object.assign({},defaultQuestion);
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateQuestion(this.question).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                createQuestion(this.question).then(response => {
                  this.$refs[formName].resetFields();
                  this.question = Object.assign({},defaultQuestion);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.question = Object.assign({},defaultQuestion);
      },
      answerAdd(){
        if(this.question.answerList == null){
          this.question.answerList = this.defaultAnwserList;
        }else{
          this.question.answerList.push(this.answer);
        }
      },
      delAnswer(index){
        this.question.answerList.splice(index,1)
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>


