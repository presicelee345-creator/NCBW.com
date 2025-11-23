import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Download, Plus, Trash2, Calendar, FileText, Save } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

interface CustomField {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "percentage";
}

interface SavedReport {
  id: string;
  name: string;
  dateRange: { start: string; end: string };
  fields: string[];
  customFields: CustomField[];
  createdDate: string;
}

export function CustomReportBuilder() {
  const [reportName, setReportName] = useState("");
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "name",
    "email",
    "track",
    "progress",
    "quizAverage"
  ]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "number" | "date" | "percentage">("text");
  const [savedReports, setSavedReports] = useState<SavedReport[]>([
    {
      id: "1",
      name: "Monthly Progress Report",
      dateRange: { start: "2025-11-01", end: "2025-11-30" },
      fields: ["name", "email", "track", "progress", "lastActive"],
      customFields: [],
      createdDate: "2025-11-15"
    },
    {
      id: "2",
      name: "At-Risk Trainees Report",
      dateRange: { start: "2025-10-01", end: "2025-11-20" },
      fields: ["name", "email", "track", "progress", "lastActive", "quizAverage"],
      customFields: [
        { id: "c1", name: "Days Inactive", type: "number" },
        { id: "c2", name: "Risk Level", type: "text" }
      ],
      createdDate: "2025-11-10"
    }
  ]);
  const [filterTrack, setFilterTrack] = useState("all");
  const [filterProgress, setFilterProgress] = useState("all");

  // Default available fields
  const defaultFields = [
    { id: "name", label: "Trainee Name", category: "Basic" },
    { id: "email", label: "Email Address", category: "Basic" },
    { id: "track", label: "Leadership Track", category: "Basic" },
    { id: "progress", label: "Progress Percentage", category: "Progress" },
    { id: "lastActive", label: "Last Active Date", category: "Activity" },
    { id: "quizAverage", label: "Average Quiz Score", category: "Performance" },
    { id: "modulesCompleted", label: "Modules Completed", category: "Progress" },
    { id: "totalQuizzes", label: "Total Quizzes Taken", category: "Performance" },
    { id: "enrollmentDate", label: "Enrollment Date", category: "Basic" },
    { id: "certificateStatus", label: "Certificate Status", category: "Progress" },
    { id: "timeSpent", label: "Total Time Spent", category: "Activity" },
    { id: "coursesCompleted", label: "Courses Completed", category: "Progress" }
  ];

  const handleToggleField = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleAddCustomField = () => {
    if (!newFieldName.trim()) {
      toast.error("Please enter a field name");
      return;
    }

    const newField: CustomField = {
      id: `custom-${Date.now()}`,
      name: newFieldName,
      type: newFieldType
    };

    setCustomFields([...customFields, newField]);
    setNewFieldName("");
    setNewFieldType("text");
    setIsAddingField(false);
    toast.success("Custom field added successfully!");
  };

  const handleDeleteCustomField = (fieldId: string) => {
    setCustomFields(customFields.filter((f) => f.id !== fieldId));
    toast.success("Custom field removed");
  };

  const handleSaveReport = () => {
    if (!reportName.trim()) {
      toast.error("Please enter a report name");
      return;
    }

    if (!dateRangeStart || !dateRangeEnd) {
      toast.error("Please select a date range");
      return;
    }

    if (selectedFields.length === 0 && customFields.length === 0) {
      toast.error("Please select at least one field");
      return;
    }

    const newReport: SavedReport = {
      id: Date.now().toString(),
      name: reportName,
      dateRange: { start: dateRangeStart, end: dateRangeEnd },
      fields: selectedFields,
      customFields: customFields,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setSavedReports([newReport, ...savedReports]);
    toast.success(`Report "${reportName}" saved successfully!`);
    
    // Reset form
    setReportName("");
    setDateRangeStart("");
    setDateRangeEnd("");
    setSelectedFields(["name", "email", "track", "progress", "quizAverage"]);
    setCustomFields([]);
  };

  const handleGenerateReport = () => {
    if (!reportName.trim()) {
      toast.error("Please enter a report name");
      return;
    }

    if (!dateRangeStart || !dateRangeEnd) {
      toast.error("Please select a date range");
      return;
    }

    if (selectedFields.length === 0 && customFields.length === 0) {
      toast.error("Please select at least one field");
      return;
    }

    // Build CSV header
    const headers: string[] = [];
    selectedFields.forEach((fieldId) => {
      const field = defaultFields.find((f) => f.id === fieldId);
      if (field) headers.push(field.label);
    });
    customFields.forEach((field) => headers.push(field.name));

    // Mock data for demonstration
    const mockData = [
      ["Sarah Johnson", "sarah.j@example.com", "President", "65%", "2 hours ago", "87%", "3", "5", "2025-09-15", "In Progress", "24.5 hrs", "15"],
      ["Maria Garcia", "maria.g@example.com", "Vice President", "42%", "1 day ago", "78%", "2", "3", "2025-10-01", "In Progress", "18.2 hrs", "10"],
      ["Keisha Williams", "keisha.w@example.com", "Treasurer", "78%", "3 hours ago", "90%", "4", "7", "2025-08-20", "In Progress", "32.8 hrs", "20"]
    ];

    const csvContent = [
      headers.join(","),
      ...mockData.map((row) => 
        row.slice(0, headers.length).join(",")
      )
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportName.replace(/\\s+/g, '_')}_${dateRangeStart}_to_${dateRangeEnd}.csv`;
    a.click();
    
    toast.success(`Report "${reportName}" generated and downloaded!`);
  };

  const handleLoadReport = (report: SavedReport) => {
    setReportName(report.name);
    setDateRangeStart(report.dateRange.start);
    setDateRangeEnd(report.dateRange.end);
    setSelectedFields(report.fields);
    setCustomFields(report.customFields);
    toast.info(`Loaded report: ${report.name}`);
  };

  const handleDeleteReport = (reportId: string) => {
    setSavedReports(savedReports.filter((r) => r.id !== reportId));
    toast.success("Report deleted");
  };

  const getFieldsByCategory = (category: string) => {
    return defaultFields.filter((f) => f.category === category);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#c6930a]" />
            Custom Report Builder
          </CardTitle>
          <CardDescription>
            Create custom reports with specific date ranges, fields, and filters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Name and Date Range */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Report Name *</Label>
              <Input
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="e.g., November Progress Report"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date *
              </Label>
              <Input
                type="date"
                value={dateRangeStart}
                onChange={(e) => setDateRangeStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                End Date *
              </Label>
              <Input
                type="date"
                value={dateRangeEnd}
                onChange={(e) => setDateRangeEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="border-t pt-6">
            <h4 className="mb-4">Report Filters</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Filter by Track</Label>
                <Select value={filterTrack} onValueChange={setFilterTrack}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tracks</SelectItem>
                    <SelectItem value="president">President</SelectItem>
                    <SelectItem value="vicepresident">Vice President</SelectItem>
                    <SelectItem value="secondvp">Second VP</SelectItem>
                    <SelectItem value="thirdvp">Third VP</SelectItem>
                    <SelectItem value="treasurer">Treasurer</SelectItem>
                    <SelectItem value="financialsecretary">Financial Secretary</SelectItem>
                    <SelectItem value="correspondingsecretary">Corresponding Secretary</SelectItem>
                    <SelectItem value="chaplain">Chaplain</SelectItem>
                    <SelectItem value="parliamentarian">Parliamentarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Filter by Progress</Label>
                <Select value={filterProgress} onValueChange={setFilterProgress}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Progress Levels</SelectItem>
                    <SelectItem value="not_started">Not Started (0%)</SelectItem>
                    <SelectItem value="in_progress">In Progress (1-99%)</SelectItem>
                    <SelectItem value="completed">Completed (100%)</SelectItem>
                    <SelectItem value="at_risk">At Risk (&lt;40%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Field Selection */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4>Select Report Fields</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddingField(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Custom Field
              </Button>
            </div>

            {/* Default Fields by Category */}
            <div className="space-y-4">
              {["Basic", "Progress", "Performance", "Activity"].map((category) => (
                <div key={category} className="border rounded-lg p-4">
                  <h5 className="mb-3 text-sm text-[#c6930a]">{category} Information</h5>
                  <div className="grid grid-cols-2 gap-3">
                    {getFieldsByCategory(category).map((field) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={field.id}
                          checked={selectedFields.includes(field.id)}
                          onCheckedChange={() => handleToggleField(field.id)}
                        />
                        <label
                          htmlFor={field.id}
                          className="text-sm cursor-pointer"
                        >
                          {field.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Custom Fields */}
              {customFields.length > 0 && (
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h5 className="mb-3 text-sm text-[#c6930a]">Custom Fields</h5>
                  <div className="space-y-2">
                    {customFields.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between p-2 bg-white rounded border"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{field.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {field.type}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteCustomField(field.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Report Summary */}
          <div className="border-t pt-6">
            <div className="bg-gray-50 border rounded-lg p-4">
              <h4 className="mb-3">Report Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Report Name:</p>
                  <p>{reportName || "Not set"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date Range:</p>
                  <p>
                    {dateRangeStart && dateRangeEnd
                      ? `${dateRangeStart} to ${dateRangeEnd}`
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total Fields:</p>
                  <p>{selectedFields.length + customFields.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleGenerateReport}
              className="flex-1 bg-[#c6930a] hover:bg-[#a37808] gap-2"
            >
              <Download className="h-4 w-4" />
              Generate & Download Report
            </Button>
            <Button
              onClick={handleSaveReport}
              variant="outline"
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Report Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Saved Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Report Configurations</CardTitle>
          <CardDescription>
            Load previously saved report configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {savedReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4>{report.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {report.fields.length + report.customFields.length} fields
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {report.dateRange.start} to {report.dateRange.end} • Created: {report.createdDate}
                  </p>
                  {report.customFields.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {report.customFields.map((field) => (
                        <Badge key={field.id} className="text-xs bg-blue-100 text-blue-700">
                          {field.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLoadReport(report)}
                    className="gap-1"
                  >
                    <FileText className="h-3 w-3" />
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerateReport()}
                    className="gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Generate
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteReport(report.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Custom Field Dialog */}
      <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#c6930a]">Add Custom Field</DialogTitle>
            <DialogDescription>
              Create a custom field to include in your report
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Field Name *</Label>
              <Input
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="e.g., Days Since Last Login"
              />
            </div>

            <div className="space-y-2">
              <Label>Field Type *</Label>
              <Select value={newFieldType} onValueChange={(value: any) => setNewFieldType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                💡 <strong>Tip:</strong> Custom fields will need to be populated with data when generating the report. You can add formulas or manual data entry for these fields.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingField(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomField}
              className="bg-[#c6930a] hover:bg-[#a37808]"
            >
              Add Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}