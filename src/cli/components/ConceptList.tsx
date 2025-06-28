import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { conceptRules } from '../../core/concept-mapper/concept-rules';

export const ConceptList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'craft' | 'process' | 'product'>('all');
  const [showDetails, setShowDetails] = useState(false);

  const categories = ['all', 'craft', 'process', 'product'] as const;
  const filteredConcepts = conceptRules.filter(
    rule => selectedCategory === 'all' || rule.category === selectedCategory
  );

  const conceptsByCategory = {
    craft: conceptRules.filter(r => r.category === 'craft'),
    process: conceptRules.filter(r => r.category === 'process'),
    product: conceptRules.filter(r => r.category === 'product'),
  };

  useInput((input, key) => {
    if (key.leftArrow) {
      const currentIndex = categories.indexOf(selectedCategory);
      const newIndex = currentIndex > 0 ? currentIndex - 1 : categories.length - 1;
      setSelectedCategory(categories[newIndex]);
    } else if (key.rightArrow) {
      const currentIndex = categories.indexOf(selectedCategory);
      const newIndex = currentIndex < categories.length - 1 ? currentIndex + 1 : 0;
      setSelectedCategory(categories[newIndex]);
    } else if (input === 'd' || input === 'D') {
      setShowDetails(prev => !prev);
    } else if (key.escape || input === 'q' || input === 'Q') {
      process.exit(0);
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={2}>
        <Text bold color="cyan">
          📚 Available Concepts Library
        </Text>
      </Box>

      {/* Category Navigation */}
      <Box marginBottom={2}>
        <Text color="yellow" marginRight={2}>Filter by category:</Text>
        {categories.map(category => (
          <Box key={category} marginRight={2}>
            <Text
              color={selectedCategory === category ? 'black' : 'white'}
              backgroundColor={selectedCategory === category ? 'cyan' : undefined}
            >
              {category.toUpperCase()}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Summary */}
      <Box flexDirection="column" marginBottom={2}>
        <Text bold color="yellow">Summary:</Text>
        <Text>• CRAFT (Code Quality): <Text color="green">{conceptsByCategory.craft.length} concepts</Text></Text>
        <Text>• PROCESS (Workflow): <Text color="green">{conceptsByCategory.process.length} concepts</Text></Text>
        <Text>• PRODUCT (User Experience): <Text color="green">{conceptsByCategory.product.length} concepts</Text></Text>
        <Text>• Total: <Text color="green">{conceptRules.length} concepts</Text></Text>
      </Box>

      {/* Concepts List */}
      <Box flexDirection="column" marginBottom={2}>
        <Text bold color="yellow">
          {selectedCategory === 'all' ? 'All Concepts' : `${selectedCategory.toUpperCase()} Concepts`} 
          ({filteredConcepts.length}):
        </Text>
        
        <Box flexDirection="column" marginLeft={2} marginTop={1}>
          {filteredConcepts
            .sort((a, b) => b.priority - a.priority)
            .map(concept => (
              <ConceptItem
                key={concept.conceptId}
                concept={concept}
                showDetails={showDetails}
              />
            ))}
        </Box>
      </Box>

      {/* Details Toggle */}
      <Box marginBottom={1}>
        <Text color="cyan">
          [D] {showDetails ? 'Hide' : 'Show'} Detailed Conditions
        </Text>
      </Box>

      {/* Legend */}
      <Box flexDirection="column" marginBottom={1}>
        <Text bold color="yellow">Category Legend:</Text>
        <Text>• <Text color="blue">CRAFT</Text>: Code quality, testing, architecture, TypeScript</Text>
        <Text>• <Text color="green">PROCESS</Text>: Workflow, infrastructure, documentation</Text>
        <Text>• <Text color="magenta">PRODUCT</Text>: UI/UX, accessibility, internationalization</Text>
      </Box>

      {/* Instructions */}
      <Text color="gray">
        Use ←→ to change category, D for details, Q to quit
      </Text>
    </Box>
  );
};

interface ConceptItemProps {
  concept: typeof conceptRules[0];
  showDetails: boolean;
}

const ConceptItem: React.FC<ConceptItemProps> = ({ concept, showDetails }) => {
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'craft': return 'blue';
      case 'process': return 'green';
      case 'product': return 'magenta';
      default: return 'white';
    }
  };

  const formatConceptName = (id: string): string => {
    return id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatCondition = (condition: any): string => {
    return `${condition.field} ${condition.operator} ${JSON.stringify(condition.value)}`;
  };

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text color={getCategoryColor(concept.category)} bold>
          [{concept.category.toUpperCase()}]
        </Text>
        <Text color="white" marginLeft={1}>
          {formatConceptName(concept.conceptId)}
        </Text>
        <Text color="gray" marginLeft={1}>
          (Priority: {concept.priority})
        </Text>
      </Box>
      
      {showDetails && concept.conditions.length > 0 && (
        <Box marginLeft={2} marginTop={1}>
          <Text color="yellow">Conditions:</Text>
          {concept.conditions.map((condition, index) => (
            <Box key={index} marginLeft={2}>
              <Text color="gray">
                • {formatCondition(condition)}
              </Text>
            </Box>
          ))}
        </Box>
      )}

      {showDetails && concept.conflicts && concept.conflicts.length > 0 && (
        <Box marginLeft={2}>
          <Text color="red">
            Conflicts: {concept.conflicts.join(', ')}
          </Text>
        </Box>
      )}
    </Box>
  );
};