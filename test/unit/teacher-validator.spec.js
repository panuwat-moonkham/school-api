'use strict'

const { test } = use('Test/Suite')('Teacher Validator')
const teacherValidator = require('../../service/TeacherValidator')

function sum(){
  return 2+2
}

test('should recive object as first parameter', async ({ assert }) => {
  const validatedData = await teacherValidator({
   first_name:"john",
   last_name:"doe",
   email:"wrong mail",
   password:"12345678"
 })
 assert.isOk(validatedData)

 const validatedDate2 = await teacherValidator("john","doe","wrong mail","12345678")
  assert.isNotOk(validatedDate2)
 })

test('should return error when pass incorrect data', async ({ assert }) => {
 const validatedData = await teacherValidator("john","doe","wrong mail","12345678")
 assert.isArray(validatedData.error)
})

test('should return only one error if single incorrect data is passed', async ({ assert }) => {
  const validatedData = await teacherValidator({
    first_name:"john",
    last_name:"doe",
    email:"john@mail.com",
    password:"12345678"
  })
  assert.equal(validatedData.error.length,1)
 })

test('should return more than one error if multiiple incorrect data passed',async({assert}) => {
  const validatedData = await teacherValidator("john","doe","wrong mail","12345678")
  assert.isAbove(validatedData.error.length, 1)
})

test('should return undefined when pass correct data',async ({assert})=>{
  const validatedData = await teacherValidator({
    first_name:"john",
    last_name:"doe",
    email:"john@mail.com",
    password:"12345678"
  })
  assert.equal(validatedData.error, undefined)
})