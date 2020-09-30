<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="questionType"
             :rules="rules"
             ref="questionTypeFrom"
             label-width="150px"
             size="small">
      <el-form-item label="名称：" prop="title">
        <el-input v-model="questionType.type" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="logo：">
        <single-upload v-model="questionType.pic"></single-upload>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="questionType.comment" class="input-width"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('questionTypeFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('questionTypeFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import SingleUpload from '@/components/Upload/singleUpload'
  import {createType, getTypeById, updateType} from '@/api/questionType'

  const defaultQuestionType = {
    type: null,
    comment: null,
    pic: null,
  };
  export default {
    name: 'questionTypeDetail',
    components:{SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        questionType: null,
        rules: {
          type: [
            {required: true, message: '请输入题目标题', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ]
        },

      }
    },
    created(){
      if (this.isEdit) {
        getTypeById(this.$route.query.id).then(response => {
          this.questionType = response.data;
        });
      }else{
        this.questionType = Object.assign({},defaultQuestionType);
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
                updateType(this.$route.query.id, this.questionType).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                createType(this.questionType).then(response => {
                  this.$refs[formName].resetFields();
                  this.question = Object.assign({},defaultQuestionType);
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
        this.question = Object.assign({},defaultQuestionType);
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>


