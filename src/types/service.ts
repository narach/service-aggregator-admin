export interface ServiceGroup {
    id: number;
    name: string;
    description: string;
  }
  
export interface ServiceCategory {
    id: number;
    name: string;
    description: string;
    group: ServiceGroup;
}
