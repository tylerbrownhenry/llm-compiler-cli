export interface ContentSection {
  id: string;
  section: string;
  content: string;
  priority: number;
  variables?: Record<string, any>;
}

export interface ContentTemplate {
  format: string;
  templatePath: string;
  content: string;
}

export interface ProcessedContent {
  sections: ContentSection[];
  config: any;
}