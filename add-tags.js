const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, 'content/blog')
const files = fs.readdirSync(dir)

for (const file of files) {
  if (!file.endsWith('.mdx')) continue
  const p = path.join(dir, file)
  let content = fs.readFileSync(p, 'utf8')
  
  if (content.includes('tags: [')) continue

  let tags = []
  if (file.includes('google')) tags.push('Google')
  if (file.includes('facebook')) tags.push('Facebook')
  if (file.includes('trustpilot')) tags.push('Trustpilot')
  if (file.includes('reseller') || file.includes('affiliate')) tags.push('Partners')
  if (tags.length === 0) tags.push('Guide')
  if (file.includes('boost-your-business')) tags = ['Google', 'Facebook', 'Trustpilot']

  content = content.replace(/(date: ".*"\n)---/, `$1tags: ${JSON.stringify(tags)}\n---`)
  
  fs.writeFileSync(p, content)
}
console.log("Done")
