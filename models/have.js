const data = [
{
_id: new ObjectId("6305af4b8672807b94e55104"),
content: 'Demo KTR Task Nik Lussy Changed',
user: {_id: new ObjectId("630545c5f5e239dbf3ef7f85"), name: 'Nik Lussy',__v: 0},
machine: { _id: new ObjectId("63054274f5e239dbf3ef7f65"),name: 'KTR 450',__v: 0},
done: false,
date: 2022-08-24T04:55:39.201Z,
__v: 0
},
{
_id: new ObjectId("6305d41650a6ba563aca4ab7"),
content: 'Demo 2 KTR Task Nik Lussy',
user: { _id: new ObjectId("630545c5f5e239dbf3ef7f85"), name: 'Nik Lussy', __v: 0},
machine: { _id: new ObjectId("63054274f5e239dbf3ef7f65"), name: 'KTR 450', __v: 0},
done: false,
date: 2022-08-24T07:32:38.590Z,
__v: 0
},
{
_id: new ObjectId("6305d42650a6ba563aca4abf"),
content: 'Demo KTR Task Daniel',
user: {_id: new ObjectId("630546b2f5e239dbf3ef7f99"), name: 'Daniel Inderbitzin', __v: 0},
machine: {_id: new ObjectId("63054274f5e239dbf3ef7f65"), name: 'KTR 450', __v: 0 },
done: false,
date: 2022-08-24T07:32:54.871Z,
__v: 0
},
{
_id: new ObjectId("6305d43750a6ba563aca4ac7"),
content: 'Demo3 ANH10 Task Nik Lussy',
user: {_id: new ObjectId("630545c5f5e239dbf3ef7f85"), name: 'Nik Lussy', __v: 0 },
machine: {_id: new ObjectId("630546d0f5e239dbf3ef7fa5"), name: 'DMG ANH10', __v: 0 },
done: false,
date: 2022-08-24T07:33:11.318Z,
__v: 0
}
]

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
