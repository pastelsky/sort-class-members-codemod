const reactUtils = require('react-codemod/transforms/utils/ReactUtils')
const { CLIEngine } = require('eslint')


function getClassMembersSortOrderConfig(filePath) {
  let order
  const cli = new CLIEngine({ useEslintrc: true })
  try {
    const config = cli.getConfigForFile(filePath)
    const { rules } = config
    const sortOrderConfig = rules['sort-class-members/sort-class-members']
    order = sortOrderConfig[1]
  } catch (e) {
    throw new Error(`Could not locate eslint configuration in ${filePath}`)
  }
  return order
}

function getNameComparer(name) {
  if (name[0] === '/') {
    let namePattern = name.substr(1, name.length - 2)

    if (namePattern[0] !== '^') {
      namePattern = `^${namePattern}`
    }

    if (namePattern[namePattern.length - 1] !== '$') {
      namePattern += '$'
    }

    const re = new RegExp(namePattern)

    return n => re.test(n)
  }

  return n => n === name
}


function expandSlot(input, groups) {
  if (Array.isArray(input)) {
    return input.map(x => expandSlot(x, groups))
  }

  let slot
  if (typeof input === 'string') {
    slot = input[0] === '[' // check for [groupName] shorthand
      ? { group: input.substr(1, input.length - 2) }
      : { name: input }
  } else {
    slot = Object.assign({}, input)
  }

  if (slot.group) {
    if (groups.hasOwnProperty(slot.group)) {
      return expandSlot(groups[slot.group], groups)
    }

    // ignore undefined groups
    return []
  }

  const testName = slot.name && getNameComparer(slot.name)
  if (testName) {
    slot.testName = testName
  }

  return [slot]
}

function flatten(collection) {
  const result = []

  for (const item of collection) {
    if (Array.isArray(item)) {
      [].push.apply(result, flatten(item))
    } else {
      result.push(item)
    }
  }

  return result
}

function getMemberInfo(node) {
  let name
  let type
  let propertyType

  if (node.type === 'ClassProperty') {
    type = 'property'
    name = node.key.name
    propertyType = node.value ? node.value.type : node.value
  } else {
    name = node.key.name
    type = 'method'
  }

  return {
    name, type, static: node.static, kind: node.kind, propertyType, node,
  }
}

function scoreMember(node, expectedOrder) {
  let score = 0
  let isScored = false
  expectedOrder.forEach((group, index) => {
    let matches = true
    if (isScored) {
      return
    }
    if (Object.keys(group).length === 0) {
      matches = false
      score = index
    }

    const memberInfo = getMemberInfo(node)
    if ('kind' in group && !(memberInfo.kind === group.kind)) {
      matches = false
    }

    if ('static' in group && !(memberInfo.static === group.static)) {
      matches = false
    }

    if ('type' in group && !(memberInfo.type === group.type)) {
      matches = false
    }

    if (group.type === 'property' && 'propertyType' in group && !(group.propertyType === memberInfo.propertyType)) {
      matches = false
    }

    if ('name' in group) {
      matches = getNameComparer(group.name)(memberInfo.name)
    }

    if (matches) {
      isScored = true
      score = index
    }
  })

  return score
}

const builtInGroups = {
  'properties': { type: 'property' },
  'getters': { kind: 'get' },
  'setters': { kind: 'set' },
  'static-properties': { type: 'property', static: true },
  'conventional-private-properties': { type: 'property', name: '/_.+/' },
  'arrow-function-properties': { propertyType: 'ArrowFunctionExpression' },
  'methods': { type: 'method' },
  'static-methods': { type: 'method', static: true },
  'conventional-private-methods': { type: 'method', name: '/_.+/' },
  'everything-else': {},
}

function getExpectedOrder(order, groups) {
  return flatten(order.map(s => expandSlot(s, groups)))
}


module.exports = function transformer(fileInfo, api, options = {}) {
  let j = api.jscodeshift
  const ReactUtils = reactUtils(j)
  const root = j(fileInfo.source)

  const eslintOptions = getClassMembersSortOrderConfig(fileInfo.path)

  const expectedOrder = getExpectedOrder(
    eslintOptions.order,
    Object.assign({}, builtInGroups, eslintOptions.groups)
  )

  const propertyComparator = (a, b) => {
    return scoreMember(a, expectedOrder) - scoreMember(b, expectedOrder)
  }

  const sortClassProperties = classPath => {
    const spec = ReactUtils.getClassExtendReactSpec(classPath)

    if (spec) {
      spec.body.sort(propertyComparator)
    }
  }

  if (options.reactOnly && ReactUtils.hasReact(root)) {
    const es6ClassSortCandidates = ReactUtils.findReactES6ClassDeclaration(root)

    if (es6ClassSortCandidates.size() > 0) {
      es6ClassSortCandidates.forEach(sortClassProperties)
    }
  } else {
    root.find(j.ClassDeclaration).forEach(sortClassProperties)
  }

  return root.toSource()
}
