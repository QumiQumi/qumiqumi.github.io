(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-75fa7c6a"],{"089d":function(e,t,s){"use strict";s("92d5")},"92d5":function(e,t,s){},"94eb":function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"timetable d-flex flex-column"},["admin"===e.role?s("h1",[e._v("Изменить расписание")]):s("h1",[e._v("Расписание")]),s("nav",{staticClass:"timetable__nav d-flex flex-nowrap"},["admin"===e.role||"class_teacher"===e.role||"teacher"===e.role?s("div",{staticClass:"timetable__select-class"},[s("v-select",{attrs:{outlined:"",dense:"","append-icon":"mdi-chevron-down",items:e.classes,"item-text":"class_number","item-value":"id"},on:{change:e.loadTimetable},model:{value:e.classesSelect,callback:function(t){e.classesSelect=t},expression:"classesSelect"}},[e._v("Класс")])],1):e._e(),"student"===e.role?s("h2",[e._v(" Мое расписание: "+e._s(e.$store.getters.classNumber)+" ")]):e._e()]),s("div",{staticClass:"timetable__carusel white--text d-flex justify-space-between align-center"},[s("v-icon",{attrs:{color:"white"},on:{click:function(t){return e.loadTimetable("down")}}},[e._v("mdi-arrow-left")]),e._v(" "+e._s(e.date)+" "),s("v-icon",{attrs:{color:"white"},on:{click:function(t){return e.loadTimetable("up")}}},[e._v("mdi-arrow-right")])],1),s("div",{staticClass:"timetable__grid"},[s("div",{staticClass:"timetable__time"},e._l(e.time,(function(t,a){return s("div",{key:a},[e._v(e._s(t))])})),0),s("div",{staticClass:"timetable__days"},e._l(e.days,(function(t,a){return s("div",{key:a},[e._v(e._s(t))])})),0),s("div",{staticClass:"timetable__lessons"},e._l(e.lessons,(function(t,a){return s("div",{key:a,staticClass:"timetable__lessons-column"},e._l(t,(function(t,a){return s("div",{key:a,staticClass:"timetable__cell"},[t.isEmpty&&"admin"===e.role?s("div",{staticClass:"timetable__cell-add",on:{click:function(s){return e.modalOpen("add",t)}}},[s("v-icon",{attrs:{large:""}},[e._v("mdi-plus")])],1):t.isEmpty&&"admin"!=e.role?s("div",{staticClass:"timetable__cell-empty"}):s("div",{staticClass:"timetable__cell-lesson"},[s("div",{on:{click:function(s){return e.redirectToLesson(t)}}},[t.subject?s("p",[e._v(e._s(t.subject.name))]):e._e(),t.teacher?s("i",[e._v(e._s(t.teacher.full_name))]):e._e()]),s("v-icon",{staticClass:"timetable__cell-lesson__icon-close",class:{"d-none":"admin"!=e.role},attrs:{small:""},on:{click:function(s){return e.modalOpen("delete",t)}}},[e._v("mdi-close")])],1)])})),0)})),0)]),s("v-dialog",{attrs:{width:"fit-content"},model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[s("modal-panel",e._b({on:{cancel:e.modalCancel,action:e.modalAction}},"modal-panel",e.modalProps,!1))],1)],1)},i=[],l=s("b2c7"),r=s("bc3a"),o=s.n(r),n={async created(){await this.$store.dispatch("get",{getWhat:"classes"}),this.classesSelect=this.classes[0].id,this.loadTimetable(),this.getTeachers(),this.getSubjects()},data(){return{dialog:!1,action:"",modalProps:{},editedItem:"",classesSelect:"",lessons:{monday:"",tuesday:"",wednesday:"",thursday:"",friday:"",saturday:""},time:["8:50 - 9:30","8:00 - 8:40","9:45 - 10:25","10:40 - 11:20","11:35 - 12:15","12:25 - 13:05","13:10 - 13:50","14:00 - 14:40"],days:["Пн","Вт","Ср","Чт","Пт","Сб"],modalValidateRules:{required:function(e){return!!e||"Необходимо заполнить поле"}},subjectId:""}},computed:{role(){return this.$store.getters.role},classes(){return this.$store.getters.classes},teachers(){let e=this.$store.getters.teachers;return e.forEach(e=>{e.name=e.full_name}),e},subjects(){return this.$store.getters.subjects},timetable(){return this.$store.getters.timetable},date(){let e={month:"numeric",day:"numeric"},t=new Date(this.timetable.start_date);return this.timetable.start_date?t.toLocaleString("ru",e)+" - "+new Date(t.setDate(t.getDate()+7)).toLocaleString("ru",e):""},currentDate(){return this.timetable.start_date?this.timetable.start_date:new Date}},methods:{async getTeachers(){await this.$store.dispatch("get",{getWhat:"teachers"})},async getSubjects(){await this.$store.dispatch("get",{getWhat:"subjects"})},clearTable(){for(let e in this.lessons)this.lessons[e]=""},async loadTimetable(e=""){let t=s(e,this.currentDate);function s(e,t){let s=new Date(t),a=s.getDay(),i=s.getDate()-a+(0==a?-6:1),l=new Date(s.setDate(i));switch(e){case"up":l=l.addDays(7);break;case"down":l=l.addDays(-7);break}return`${l.getFullYear()}-${l.getMonth()+1}-${l.getDate()}`}await this.$store.dispatch("get",{getWhat:"timetable",id:this.classesSelect,params:{start_date:t}}),this.getTimetable(),Date.prototype.addDays=function(e){var t=new Date(this.valueOf());return t.setDate(t.getDate()+e),t}},getTimetable(){let e=1;for(let t in this.lessons)this.lessons[t]=this.getLessonsForDay(e),e++},getLessonsForDay(e){let t=this.$store.getters.timetable,s=t.lessons.filter(t=>t.week_day===e).sort((e,t)=>e.lesson_number-t.lesson_number);for(let a=0;a<=s.length;a++){let i=a+1,l={timetable_id:t.id,lesson_number:i,week_day:e,isEmpty:!0};if(a===s.length){for(let r=a;r<8;r++)i=r+1,l={timetable_id:t.id,lesson_number:i,week_day:e,isEmpty:!0},s.push(l);break}{const e=s[a];e.lesson_number!==i&&s.splice(a,0,l)}if(a>=8)break}return s},deleteLesson(){o.a.delete(l["g"]+"/"+this.editedItem.id,{headers:{Authorization:"Bearer "+this.$store.getters.token}}).then(()=>{this.loadTimetable(),this.$store.dispatch("loadingOff")}).catch(e=>{this.$store.dispatch("loadingOff"),console.error(e)})},addLesson(e){o.a.post(l["g"],e,{headers:{Authorization:"Bearer "+this.$store.getters.token}}).then(()=>{this.loadTimetable(),this.$store.dispatch("loadingOff")}).catch(e=>{this.$store.dispatch("loadingOff"),console.error(e)})},modalCancel(){this.dialog=!1,this.modalProps=""},modalAction(e){switch(this.dialog=!1,this.$store.dispatch("loadingOn"),this.action){case"delete":this.deleteLesson(),this.modalProps="";break;case"add":{let t={timetable_id:this.timetable.id,teacher_id:e.teacher.value,subject_id:e.subject.value,lesson_number:this.editedItem.lesson_number,week_day:this.editedItem.week_day,class_room_id:1};this.addLesson(t),this.modalProps="";break}case"time":break;case"quart":break}},modalOpen(e,t=null){switch(t&&(this.editedItem=t),this.action=e,e){case"delete":this.modalProps={title:"Удаление урока",text:"Вы действительно хотите удалить этот урок  из расписания?",actionBtnText:"Удалить"};break;case"add":this.modalProps={title:"Добавить урок",inputs:{subject:{label:"Предмет",rules:[this.modalValidateRules.required],isSearchSelect:!0,options:this.subjects,value:""},teacher:{label:"Учитель",rules:[this.modalValidateRules.required],isSearchSelect:!0,options:this.teachers,value:""}},filterSelect(){}};break;case"time":this.modalProps={title:"Настроить время",timeSet:!0};break;case"quart":this.modalProps={title:"Настроить четверть",actionBtnText:"Добавить",quartSet:!0};break}this.dialog=!0},redirectToLesson(e){let t=this.$store.getters.user.id;"student"!==this.role&&t!==e.teacher.id||this.$router.push({name:"lesson",params:{id:e.id}})}}},c=n,d=(s("089d"),s("2877")),h=s("6544"),u=s.n(h),m=s("169a"),_=s("132d"),b=s("b974"),g=Object(d["a"])(c,a,i,!1,null,null,null);t["default"]=g.exports;u()(g,{VDialog:m["a"],VIcon:_["a"],VSelect:b["a"]})}}]);
//# sourceMappingURL=chunk-75fa7c6a.9c43e58c.js.map