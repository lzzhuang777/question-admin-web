<template> 
  <Question-Detail :isEdit="false"></Question-Detail>
</template>
<script>
  import QuestionDetail from './components/QuestionDetail'
  export default {
    name: 'addQuestion',
    components: { QuestionDetail }
  }
</script>
<style></style>


