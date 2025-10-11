using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace ATSRecruitSys.Server.Configuration
{
    /// <summary>
    /// Swagger operation filter to properly document file upload parameters
    /// </summary>
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var hasFormFile = context.MethodInfo.GetParameters()
                .Any(p => p.ParameterType == typeof(IFormFile) || 
                         (p.ParameterType.IsGenericType && 
                          p.ParameterType.GetGenericTypeDefinition() == typeof(List<>) && 
                          p.ParameterType.GetGenericArguments()[0] == typeof(IFormFile)));

            if (!hasFormFile)
                return;

            // Clear existing request body
            operation.RequestBody = new OpenApiRequestBody
            {
                Required = true,
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties = new Dictionary<string, OpenApiSchema>(),
                            Required = new HashSet<string>()
                        }
                    }
                }
            };

            var schema = operation.RequestBody.Content["multipart/form-data"].Schema;
            var parameters = context.MethodInfo.GetParameters();

            foreach (var parameter in parameters)
            {
                var paramType = parameter.ParameterType;
                var paramName = parameter.Name ?? "unknown";
                
                // Handle IFormFile
                if (paramType == typeof(IFormFile))
                {
                    schema.Properties[paramName] = new OpenApiSchema
                    {
                        Type = "string",
                        Format = "binary",
                        Description = $"Upload {paramName} file"
                    };
                    
                    if (!parameter.HasDefaultValue)
                    {
                        schema.Required.Add(paramName);
                    }
                }
                // Handle List<IFormFile>
                else if (paramType.IsGenericType && 
                         paramType.GetGenericTypeDefinition() == typeof(List<>) && 
                         paramType.GetGenericArguments()[0] == typeof(IFormFile))
                {
                    schema.Properties[paramName] = new OpenApiSchema
                    {
                        Type = "array",
                        Items = new OpenApiSchema
                        {
                            Type = "string",
                            Format = "binary"
                        },
                        Description = $"Upload multiple {paramName} files"
                    };
                }
                // Handle [FromForm] DTOs
                else if (parameter.GetCustomAttribute<Microsoft.AspNetCore.Mvc.FromFormAttribute>() != null &&
                         paramType.IsClass && paramType != typeof(string))
                {
                    var properties = paramType.GetProperties(BindingFlags.Public | BindingFlags.Instance);
                    
                    foreach (var property in properties)
                    {
                        var propertyName = char.ToLowerInvariant(property.Name[0]) + property.Name.Substring(1);
                        
                        schema.Properties[propertyName] = new OpenApiSchema
                        {
                            Type = GetOpenApiType(property.PropertyType),
                            Format = GetOpenApiFormat(property.PropertyType),
                            Description = property.Name
                        };
                        
                        // Check if property is required (not nullable)
                        if (Nullable.GetUnderlyingType(property.PropertyType) == null && 
                            property.PropertyType.IsValueType)
                        {
                            schema.Required.Add(propertyName);
                        }
                    }
                }
            }

            // Remove parameters from operation.Parameters since they're now in RequestBody
            operation.Parameters?.Clear();
        }

        private string GetOpenApiType(Type type)
        {
            // Handle nullable types
            var underlyingType = Nullable.GetUnderlyingType(type) ?? type;
            
            if (underlyingType == typeof(int) || underlyingType == typeof(long) || 
                underlyingType == typeof(short) || underlyingType == typeof(byte))
                return "integer";
            
            if (underlyingType == typeof(float) || underlyingType == typeof(double) || 
                underlyingType == typeof(decimal))
                return "number";
            
            if (underlyingType == typeof(bool))
                return "boolean";
            
            if (underlyingType == typeof(DateTime) || underlyingType == typeof(DateTimeOffset))
                return "string";
            
            if (underlyingType.IsArray || (underlyingType.IsGenericType && 
                underlyingType.GetGenericTypeDefinition() == typeof(List<>)))
                return "array";
            
            return "string";
        }

        private string? GetOpenApiFormat(Type type)
        {
            var underlyingType = Nullable.GetUnderlyingType(type) ?? type;
            
            if (underlyingType == typeof(int))
                return "int32";
            
            if (underlyingType == typeof(long))
                return "int64";
            
            if (underlyingType == typeof(float))
                return "float";
            
            if (underlyingType == typeof(double))
                return "double";
            
            if (underlyingType == typeof(DateTime) || underlyingType == typeof(DateTimeOffset))
                return "date-time";
            
            return null;
        }
    }
}
