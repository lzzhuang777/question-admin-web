<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="question"
             :rules="rules"
             ref="questionFrom"
             label-width="150px"
             size="small">
      <el-form-item label="题目标题：" prop="name">
        <el-input v-model="question.title" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="题目答案：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="question.answer">
        </el-input>
      </el-form-item>
      <el-form-item label="题目等级：">
        <el-select v-model="question.type">
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
          <el-radio :label="0">下线</el-radio>
          <el-radio :label="1">上线</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="question.displayOrder" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="题目类型：">
        <el-input v-model="question.type" class="input-width"></el-input>
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
  import {createQuestion, getQuestionById, updateQuestion} from '@/api/question'
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
    title: null,
    type: -1,
    answer: null,
    level: 1,
    subTitle: null,
    status: 0,
    displayOrder: 0
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
        question: null,
        rules: {
         /*name: [
            {required: true, message: '请输入广告名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],*/

        },
        typeOptions: Object.assign({}, defaultTypeOptions)
      }
    },
    created(){
      if (this.isEdit) {
        getQuestionById(this.$route.query.id).then(response => {
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
                updateQuestion(this.$route.query.id, this.question).then(response => {
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
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>


