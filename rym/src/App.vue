<script>
import {all} from './data.ts'
export default{
  data(){
    return{

      main:all
    }
  }
}
</script>
<template>
 <div class="bg-slate-500" v-for="gen in Object.keys(main)">
  {{ gen }}

 </div>
</template>
