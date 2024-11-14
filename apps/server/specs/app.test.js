const request = require('supertest')
const app = require('../app')

describe('Server', () => {
  it('Lists an empty list of entries', (done) => {
    request(app)
      .get('/entries')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        const entries = response.body
        expect(entries).toBeInstanceOf(Array)
        expect(entries).toEqual([])
        done()
      })
      .catch((err) => done(err))
  })

  it('Creates a new entry', (done) => {
    const text =
      "Free tip: I don't own a stove, oven, or microwave, because revenge is a dish best served cold."
    const author = 'Chuck_Norris'
    request(app)
      .post('/entries')
      .send({
        text,
        author,
      })
      .expect(201)
      .then((res) => {
        const newEntry = res.body
        expect(newEntry.id).toBe(0)
        expect(newEntry.text).toBe(text)
        expect(newEntry.author).toBe(author)
        const postDate = newEntry.postDate.substring(0, 19)
        const similarDate = new Date().toISOString().substring(0, 19)
        expect(postDate).toBe(similarDate)

        done()
      })
      .catch((err) => done(err))
  })

  it('Receives lists the newly created entry', (done) => {
    request(app)
      .get('/entries')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        const entries = response.body
        expect(entries).toBeInstanceOf(Array)
        expect(entries.length).toBe(1)
        done()
      })
      .catch((err) => done(err))
  })

  describe('Error management', () => {
    it('Create an entry should fail with a long text', (done) => {
      const text = `
      A very long text. A very long text. A very long text. A very long text.
      A very long text. A very long text. A very long text. A very long text.
      A very long text. A very long text. A very long text. A very long text.
      A very long text. A very long text. A very long text. A very long text.
      A very long text. A very long text. A very long text. A very long text.
      A very long text. A very long text. A very long text. A very long text.
      A very long text. A very long text. A very long text. A very long text.

      `
      const author = 'Chuck_Norris'
      request(app)
        .post('/entries')
        .send({
          text,
          author,
        })
        .expect(400)
        .then((res) => {
          const err = res.body
          expect()
          expect(typeof err.error).toBe('string')
          done()
        })
        .catch((err) => done(err))
    })
    it('Create an entry should fail without an author', (done) => {
      const text = `sample text`
      request(app)
        .post('/entries')
        .send({
          text,
          author: '',
        })
        .expect(400)
        .then((res) => {
          const err = res.body
          expect()
          expect(typeof err.error).toBe('string')
          done()
        })
        .catch((err) => done(err))
    })
    it('Create an entry should fail with strange characters in the author string', (done) => {
      const text = `sample text`
      const author = 'Chuck*)#@ER'
      request(app)
        .post('/entries')
        .send({
          text,
          author,
        })
        .expect(400)
        .then((res) => {
          const err = res.body
          expect()
          expect(typeof err.error).toBe('string')
          done()
        })
        .catch((err) => done(err))
    })
  })
})
