Salü 
Ich hät mal en frag zu node 😉 bin scho die ganz zit chli am probieren aber han no kei lösig wo mer passt. 
bin anere Todo liste am probiere und han "tasks" wo en user und maschine zuegwise hend. 
I de übersicht wot ich die jetzt nach maschine sortiert darstelle am liebste natürlich scho richtig ufbereitet bevor's is template gad.  han sho jenstes probiert aber stah grad ah. wasi ane bracht han isch dases im template mideme forloop und if- statements tags ifüägt. find ich aber eher als gebastel 
/*Datenstruktur*/ 
machine{id, Name}
user{id, Name}
task{id, userid, machineid, date, completed}

/*Aus Datenbank*/
Tasks[
  { id,user{ id, name},machine{id, name},date,completed},
  { id,user{ id, name},machine{id, name},date,completed},
  ...
]

/*Need: Task sort by machine*/
Machines[
  {
    id,name,tasks[
      { id, user{ id, name},machine{id, name},date,completed},
      { id, user{ id, name},machine{id, name},date,completed},
    ]
  },
  {
    id,name,tasks[
      { id, user{ id, name},machine{id, name},date,completed},
      { id, user{ id, name},machine{id, name},date,completed},
    ]
  },
]



  
