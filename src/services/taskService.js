const taskService = {
  getAll: async () => {
    try {
      // Initialize ApperClient
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      throw error;
    }
  },

  create: async (taskData) => {
    try {
      // Initialize ApperClient
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: taskData.title || taskData.title_c || "",
          title_c: taskData.title || taskData.title_c || "",
          description_c: taskData.description || taskData.description_c || "",
          priority_c: taskData.priority || taskData.priority_c || "medium",
          completed_c: false,
          Tags: taskData.tags || "",
          created_at_c: new Date().toISOString(),
          completed_at_c: null
        }]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`);
          throw new Error(failed[0]?.message || "Failed to create task");
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, updates) => {
    try {
      // Initialize ApperClient
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Build update payload with only Updateable fields
      const updateData = { Id: parseInt(id) };

      if (updates.title !== undefined) updateData.title_c = updates.title;
      if (updates.description !== undefined) updateData.description_c = updates.description;
      if (updates.priority !== undefined) updateData.priority_c = updates.priority;
      if (updates.completed !== undefined) {
        updateData.completed_c = updates.completed;
        updateData.completed_at_c = updates.completed ? new Date().toISOString() : null;
      }
      if (updates.tags !== undefined) updateData.Tags = updates.tags;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`);
          throw new Error(failed[0]?.message || "Failed to update task");
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      // Initialize ApperClient
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records: ${JSON.stringify(failed)}`);
          throw new Error(failed[0]?.message || "Failed to delete task");
        }
        return { success: true };
      }
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  clearCompleted: async () => {
    try {
      // Initialize ApperClient
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First, get all completed tasks
      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [{"FieldName": "completed_c", "Operator": "EqualTo", "Values": [true]}]
      };

      const fetchResponse = await apperClient.fetchRecords('task_c', params);

      if (!fetchResponse.success) {
        console.error(fetchResponse.message);
        throw new Error(fetchResponse.message);
      }

      const completedTasks = fetchResponse.data || [];
      
      if (completedTasks.length === 0) {
        return { success: true, count: 0 };
      }

      // Delete all completed tasks
      const deleteParams = { 
        RecordIds: completedTasks.map(task => task.Id)
      };

      const deleteResponse = await apperClient.deleteRecord('task_c', deleteParams);

      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        throw new Error(deleteResponse.message);
      }

      return { success: true, count: completedTasks.length };
    } catch (error) {
      console.error("Error clearing completed tasks:", error?.response?.data?.message || error);
      throw error;
    }
  }
};

export default taskService;